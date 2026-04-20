/**
 * WordPress Images → Cloudinary Migration
 *
 * Downloads featured images from sugartimes.co.in, compresses them,
 * uploads to Cloudinary, and updates MongoDB article records.
 *
 * Usage:  node migrateImages.js                  (page 1 = first 100 posts)
 *         node migrateImages.js --page=2          (specific WP page)
 *         node migrateImages.js --all             (all pages)
 *         node migrateImages.js --dry-run         (preview without uploading)
 */
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./config/db.js";
import Article from "./models/Article.js";

/* ── Cloudinary config ─────────────────────────────────────────────────── */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ── Settings ──────────────────────────────────────────────────────────── */
const WP_DOMAIN = "sugartimes.co.in";
const CLOUDINARY_FOLDER = "sugartimes/articles";
// Cloudinary transformation: resize to max 800px wide, auto quality, webp
// This keeps images small for free tier (~50-80KB each instead of 200-500KB)
const UPLOAD_OPTIONS = {
  folder: CLOUDINARY_FOLDER,
  transformation: [
    { width: 800, crop: "limit" },
    { quality: "auto:low" },
    { fetch_format: "auto" },
  ],
  resource_type: "image",
  overwrite: false,
  unique_filename: true,
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
function isWordPressImage(url) {
  return url && url.includes(WP_DOMAIN);
}

function isCloudinaryImage(url) {
  return url && url.includes("cloudinary.com");
}

async function uploadToCloudinary(imageUrl, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      ...UPLOAD_OPTIONS,
      public_id: publicId,
    });
    return result.secure_url;
  } catch (err) {
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
}

function makePublicId(article) {
  // Create a clean public ID from slug or wpId
  const base = article.slug || `wp-${article.wpId}` || article._id.toString();
  return base.slice(0, 80).replace(/[^a-zA-Z0-9_-]/g, "-");
}

/* ── Main ──────────────────────────────────────────────────────────────── */
async function migrate() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const doAll = args.includes("--all");
  const pageArg = args.find((a) => a.startsWith("--page="));
  const targetPage = pageArg ? parseInt(pageArg.split("=")[1], 10) : 1;

  await connectDB();

  // Find articles with WordPress image URLs (not yet migrated to Cloudinary)
  const filter = {
    image: { $regex: WP_DOMAIN, $options: "i" },
  };

  const totalCount = await Article.countDocuments(filter);
  console.log(`\n📊 Found ${totalCount} articles with WordPress images\n`);

  if (totalCount === 0) {
    console.log("✅ All images already migrated to Cloudinary!");
    process.exit(0);
  }

  // Process in batches of 100 (matching WP pages)
  const batchSize = 100;
  const totalBatches = Math.ceil(totalCount / batchSize);
  const startBatch = doAll ? 1 : targetPage;
  const endBatch = doAll ? totalBatches : targetPage;

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (let batch = startBatch; batch <= endBatch; batch++) {
    const skip = (batch - 1) * batchSize;
    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(batchSize);

    if (articles.length === 0) break;

    console.log(`📄 Batch ${batch}/${endBatch} — ${articles.length} articles`);

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const imageUrl = article.image;

      // Skip if already Cloudinary or not WordPress
      if (isCloudinaryImage(imageUrl) || !isWordPressImage(imageUrl)) {
        skipped++;
        continue;
      }

      const publicId = makePublicId(article);
      const progress = `[${i + 1}/${articles.length}]`;

      if (dryRun) {
        console.log(`  ${progress} [DRY] ${article.title?.slice(0, 50)}`);
        console.log(`         FROM: ${imageUrl.slice(0, 80)}...`);
        console.log(`         TO:   ${CLOUDINARY_FOLDER}/${publicId}`);
        migrated++;
        continue;
      }

      try {
        // Upload directly from URL — Cloudinary downloads, compresses, stores
        const cloudinaryUrl = await uploadToCloudinary(imageUrl, publicId);

        // Update MongoDB
        await Article.findByIdAndUpdate(article._id, { image: cloudinaryUrl });

        migrated++;
        console.log(`  ${progress} ✓ ${article.title?.slice(0, 45)} → ${(cloudinaryUrl.length > 60 ? cloudinaryUrl.slice(0, 60) + "..." : cloudinaryUrl)}`);
      } catch (err) {
        failed++;
        console.error(`  ${progress} ✗ ${article.title?.slice(0, 45)} — ${err.message}`);
      }

      // Small delay to respect Cloudinary rate limits (free tier: 500/hr)
      if (i < articles.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    console.log(`  ✓ Batch ${batch} done (migrated: ${migrated}, skipped: ${skipped}, failed: ${failed})\n`);
  }

  console.log(`
═══════════════════════════════════════════════
  Image Migration Complete${dryRun ? " (DRY RUN)" : ""}
═══════════════════════════════════════════════
  ✅ Uploaded:  ${migrated}
  ⏭️  Skipped:   ${skipped}
  ❌ Failed:    ${failed}
  📊 Total:     ${migrated + skipped + failed}
═══════════════════════════════════════════════
`);

  process.exit(0);
}

migrate().catch((err) => {
  console.error("Image migration failed:", err);
  process.exit(1);
});
