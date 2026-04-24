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

const WP_DOMAIN = "sugartimes.co.in";
const CLOUDINARY_FOLDER = "sugartimes/articles";
const UPLOAD_OPTIONS = {
  folder: CLOUDINARY_FOLDER,
  transformation: [
    { width: 800, crop: "limit" },
    { quality: "auto:low" },
    { fetch_format: "auto" },
  ],
  resource_type: "image",
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
async function uploadToCloudinary(imageUrl, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      ...UPLOAD_OPTIONS,
      public_id: publicId,
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  ⚠️ Cloudinary upload failed for ${imageUrl}: ${err.message}`);
    return imageUrl;
  }
}

async function migrateContentImages(content, article) {
  if (!content) return content;
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let newContent = content;
  const matches = [...content.matchAll(imgRegex)];
  let changed = false;

  for (let i = 0; i < matches.length; i++) {
    const originalUrl = matches[i][1];
    if (originalUrl.includes(WP_DOMAIN) && !originalUrl.includes("cloudinary.com")) {
      const publicId = `content-${article.slug || article.wpId || article._id}-${i}`;
      console.log(`    🖼️ Migrating content image ${i+1}/${matches.length}...`);
      const newUrl = await uploadToCloudinary(originalUrl, publicId);
      if (newUrl !== originalUrl) {
        newContent = newContent.replace(originalUrl, newUrl);
        changed = true;
      }
    }
  }
  return { newContent, changed };
}

/* ── Main ──────────────────────────────────────────────────────────────── */
async function cleanup() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  await connectDB();

  // Find articles that still have WordPress URLs in either 'image' or 'content'
  const filter = {
    $or: [
      { image: { $regex: WP_DOMAIN, $options: "i" } },
      { content: { $regex: WP_DOMAIN, $options: "i" } },
    ],
  };

  const totalCount = await Article.countDocuments(filter);
  console.log(`\n📊 Found ${totalCount} articles with WordPress images needing migration\n`);

  if (totalCount === 0) {
    console.log("✅ All images already migrated to Cloudinary!");
    process.exit(0);
  }

  const articles = await Article.find(filter).sort({ createdAt: -1 });

  let migrated = 0;
  let failed = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const progress = `[${i + 1}/${articles.length}]`;
    let updates = {};
    let needsUpdate = false;

    console.log(`${progress} Checking: ${article.title?.slice(0, 50)}...`);

    // 1. Check Featured Image
    if (article.image && article.image.includes(WP_DOMAIN) && !article.image.includes("cloudinary.com")) {
      if (dryRun) {
        console.log(`  📸 [DRY] Would migrate featured image`);
      } else {
        console.log(`  📸 Migrating featured image...`);
        const publicId = `featured-${article.slug || article.wpId || article._id}`;
        const newUrl = await uploadToCloudinary(article.image, publicId);
        if (newUrl !== article.image) {
          updates.image = newUrl;
          needsUpdate = true;
        }
      }
    }

    // 2. Check Content Images
    if (article.content && article.content.includes(WP_DOMAIN) && !article.content.includes("cloudinary.com")) {
      if (dryRun) {
        console.log(`  🖼️ [DRY] Would migrate content images`);
      } else {
        const { newContent, changed } = await migrateContentImages(article.content, article);
        if (changed) {
          updates.content = newContent;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate && !dryRun) {
      try {
        await Article.findByIdAndUpdate(article._id, updates);
        migrated++;
        console.log(`  ✓ Updated record`);
      } catch (err) {
        failed++;
        console.error(`  ✗ Failed to update: ${err.message}`);
      }
    } else if (!dryRun && !needsUpdate) {
      console.log(`  ⏭️ No WordPress images found in relevant fields`);
    }

    // Small delay to respect rate limits
    if (i < articles.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log(`\n═══════════════════════════════════════════════\n  Cleanup Complete${dryRun ? " (DRY RUN)" : ""}\n═══════════════════════════════════════════════\n  ✅ Updated:   ${migrated}\n  ❌ Failed:    ${failed}\n═══════════════════════════════════════════════\n`);
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});

