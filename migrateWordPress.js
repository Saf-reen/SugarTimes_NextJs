import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./config/db.js";
import Article from "./models/Article.js";

const WP_BASE = "https://sugartimes.co.in/wp-json/wp/v2";
const WP_DOMAIN = "sugartimes.co.in";
const PER_PAGE = 100;

/* ── Cloudinary config ─────────────────────────────────────────────────── */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY MAPPING — WordPress category IDs → our parent/subcategory names
   ═══════════════════════════════════════════════════════════════════════════ */
const WP_CATEGORY_MAP = {
  // ── Sugar Industry ──────────────────────────────────────────────────────
  2623: { parent: "Sugar Industry", sub: "Sugar Mill News" },    // Sugar Industry News (827)
  20974: { parent: "Sugar Industry", sub: "Sugar Mill News" },   // sugar mill (136)
  21206: { parent: "Sugar Industry", sub: "" },                  // sugar (82)
  18173: { parent: "Sugar Industry", sub: "" },                  // Cane crushing (12)
  21011: { parent: "Sugar Industry", sub: "" },                  // sugar factory (16)
  2569: { parent: "Sugar Industry", sub: "Sugar Prices" },       // Sugar Prices India (18)
  18101: { parent: "Sugar Industry", sub: "" },                  // sugar production (37)
  21693: { parent: "Sugar Industry", sub: "" },                  // Sugar Sector (30)
  2568: { parent: "Sugar Industry", sub: "Sugarcane Dept." },    // Sugarcane Department (112)
  18249: { parent: "Sugar Industry", sub: "" },                  // Sugarcane (118)
  21456: { parent: "Sugar Industry", sub: "" },                  // sugar cane production (21)
  21256: { parent: "Sugar Industry", sub: "" },                  // SUGAR CANE DISEASE (4)
  18877: { parent: "Sugar Industry", sub: "" },                  // sugar cane nursery (3)
  21046: { parent: "Sugar Industry", sub: "" },                  // SUGAR EXPORT (18)
  21305: { parent: "Sugar Industry", sub: "" },                  // sugar mill payment history (2)
  18102: { parent: "Sugar Industry", sub: "" },                  // sugar mill tokan system (1)
  20992: { parent: "Sugar Industry", sub: "" },                  // raw sugar (1)
  18247: { parent: "Sugar Industry", sub: "" },                  // chini (37)
  2: { parent: "Sugar Industry", sub: "" },                      // Featured (143)
  3418: { parent: "Sugar Industry", sub: "" },                   // Sugar Times Featured (16)
  21333: { parent: "Sugar Industry", sub: "" },                  // Print (114)
  20955: { parent: "Sugar Industry", sub: "" },                  // sugarcane farmer (15)

  // ── Ethanol ─────────────────────────────────────────────────────────────
  2636: { parent: "Ethanol", sub: "" },                          // Ethanol (487)
  2637: { parent: "Ethanol", sub: "Distillery Projects" },       // Distillery Projects (45)
  2567: { parent: "Ethanol", sub: "Molasses" },                  // Molasses (59)
  18174: { parent: "Ethanol", sub: "Biofuel Policy" },           // Biofuel (51)
  18345: { parent: "Ethanol", sub: "Biofuel Policy" },           // Ethanol & Biofuels (28)
  23620: { parent: "Ethanol", sub: "" },                         // Eathnol Production (22)
  23290: { parent: "Ethanol", sub: "Distillery Projects" },      // Eathnol and Distillery plant (5)
  23359: { parent: "Ethanol", sub: "ENA Trade" },                // ENA (1)
  25170: { parent: "Ethanol", sub: "" },                         // Bio Cng Plant (4)
  22486: { parent: "Ethanol", sub: "" },                         // Bio Gas (11)
  22728: { parent: "Ethanol", sub: "" },                         // bio plastic (2)
  23289: { parent: "Ethanol", sub: "" },                         // Meathnol (2)
  22487: { parent: "Ethanol", sub: "" },                         // Petrol and Diesel (3)
  23057: { parent: "Ethanol", sub: "" },                         // Petrolim and natural gas (1)
  23056: { parent: "Ethanol", sub: "Molasses" },                 // sheera policy (1)

  // ── Farmer / किसान ──────────────────────────────────────────────────────
  2640: { parent: "Farmer / किसान", sub: "" },                   // farmer (189)
  21692: { parent: "Farmer / किसान", sub: "Cane Farming" },      // Agricultural (29)
  21029: { parent: "Farmer / किसान", sub: "AgriTech" },          // AgroTech India (20)
  18250: { parent: "Farmer / किसान", sub: "AgriTech" },          // Agrovision (24)
  21207: { parent: "Farmer / किसान", sub: "Cane Farming" },      // fertilizer (5)
  21199: { parent: "Farmer / किसान", sub: "Cane Farming" },      // save water (2)
  21263: { parent: "Farmer / किसान", sub: "Cane Farming" },      // Maize (35)
  21338: { parent: "Farmer / किसान", sub: "SAP / FRP Rates" },   // MSP (6)
  21261: { parent: "Farmer / किसान", sub: "AgriTech" },          // cane harvester (5)
  21483: { parent: "Farmer / किसान", sub: "AgriTech" },          // Harvester (2)
  25325: { parent: "Farmer / किसान", sub: "AgriTech" },          // Protector 600 boom spare (1)

  // ── Market & Prices ─────────────────────────────────────────────────────
  2627: { parent: "Market & Prices", sub: "" },                  // Market Analysis & Reports (19)
  2641: { parent: "Market & Prices", sub: "Market Trends" },     // Market Trends (35)
  2625: { parent: "Market & Prices", sub: "Market Trends" },     // Market Trends and Analysis (10)
  2635: { parent: "Market & Prices", sub: "International Trade" }, // International Trade (25)
  2646: { parent: "Market & Prices", sub: "Export / Import" },   // Processing Techniques (20)
  2642: { parent: "Market & Prices", sub: "" },                  // Production Technique (8)
  23379: { parent: "Market & Prices", sub: "" },                 // Economic growth (3)
  23766: { parent: "Market & Prices", sub: "" },                 // Finance pre budget meeting (1)
  24227: { parent: "Market & Prices", sub: "" },                 // Excise policy (1)

  // ── Technology ──────────────────────────────────────────────────────────
  2643: { parent: "Technology", sub: "" },                       // Technology (54)
  2624: { parent: "Technology", sub: "Research & Development" }, // Research and Development (28)
  2628: { parent: "Technology", sub: "Interviews" },             // Interviews with Industry Experts (6)
  2629: { parent: "Technology", sub: "" },                       // Industry Training Institutes (12)
  20924: { parent: "Technology", sub: "" },                      // GPS (2)
  22763: { parent: "Technology", sub: "" },                      // incorporating digitalization (1)
  20915: { parent: "Technology", sub: "Research & Development" }, // Hydrogen Innovation (1)
  21255: { parent: "Technology", sub: "Research & Development" }, // green hydrogen (7)
  21400: { parent: "Technology", sub: "Research & Development" }, // GREEN HYDROGEN PLANT (2)
  25679: { parent: "Technology", sub: "" },                      // Greentech (1)
  22794: { parent: "Technology", sub: "" },                      // energy (8)
  23358: { parent: "Technology", sub: "" },                      // renewable energy (1)

  // ── Jaggery & Food ─────────────────────────────────────────────────────
  2634: { parent: "Jaggery & Food", sub: "Jaggery / Gur" },     // Jaggery (6)
  2631: { parent: "Jaggery & Food", sub: "Sugar & Health" },     // Health (5)
  2644: { parent: "Jaggery & Food", sub: "Sugar & Health" },     // Sugar Health (6)
  2638: { parent: "Jaggery & Food", sub: "Sugar & Health" },     // Sugary Nutritional (3)
  22035: { parent: "Jaggery & Food", sub: "Jaggery / Gur" },    // gud (7)
  23081: { parent: "Jaggery & Food", sub: "Food Industry" },     // Khandsari (1)
  23741: { parent: "Jaggery & Food", sub: "Sugar & Health" },    // sugary drink (1)
  23740: { parent: "Jaggery & Food", sub: "Food Industry" },     // powdered form of sugarcane juice (1)
  21311: { parent: "Jaggery & Food", sub: "Sugar & Health" },    // Artifical swetner (1)

  // ── Sustainability (map to Sugar Industry) ──────────────────────────────
  2626: { parent: "Sugar Industry", sub: "" },                   // Sustainability and Environmental Impact (64)
  2630: { parent: "Sugar Industry", sub: "" },                   // Sustainability (65)
  2632: { parent: "Sugar Industry", sub: "" },                   // Environmental Impact (57)
  20997: { parent: "Sugar Industry", sub: "" },                  // Non food biomass (3)

  // ── Others (map to Sugar Industry as default) ───────────────────────────
  2633: { parent: "Sugar Industry", sub: "" },                   // Launches (33)
  2639: { parent: "Sugar Industry", sub: "" },                   // Reviews (13)
  2645: { parent: "Sugar Industry", sub: "" },                   // Video (10)
  21353: { parent: "Sugar Industry", sub: "" },                  // aida (1)
  25524: { parent: "Technology", sub: "" },                      // NSI Entrance Exam (1)
  26029: { parent: "Ethanol", sub: "" },                         // 2nd Edition India Bioenergy (1)
  23253: { parent: "Farmer / किसान", sub: "Cane Farming" },      // Rice Grain (1)
  24226: { parent: "Technology", sub: "" },                      // gas turbine generators (1)
};

const DEFAULT_CATEGORY = { parent: "Sugar Industry", sub: "" };

function resolveCategory(wpCategoryIds) {
  let best = null;
  for (const id of wpCategoryIds) {
    const mapped = WP_CATEGORY_MAP[id];
    if (mapped) {
      if (!best || (mapped.sub && !best.sub)) {
        best = mapped;
      }
    }
  }
  return best || DEFAULT_CATEGORY;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/\n+/g, " ")
    .trim();
}

function decodeHtmlEntities(str) {
  return (str || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&hellip;/g, "…");
}

async function uploadToCloudinary(imageUrl, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      ...UPLOAD_OPTIONS,
      public_id: publicId,
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  ⚠️ Cloudinary upload failed for ${imageUrl}: ${err.message}`);
    return imageUrl; // Fallback to original URL
  }
}

async function migrateContentImages(content, postSlug, postId) {
  if (!content) return "";
  
  // Find all image tags
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  let newContent = content;
  const matches = [...content.matchAll(imgRegex)];
  
  for (let i = 0; i < matches.length; i++) {
    const originalUrl = matches[i][1];
    if (originalUrl.includes(WP_DOMAIN) && !originalUrl.includes("cloudinary.com")) {
      const publicId = `content-${postSlug || postId}-${i}`;
      console.log(`    🖼️ Migrating content image ${i+1}/${matches.length}...`);
      const newUrl = await uploadToCloudinary(originalUrl, publicId);
      newContent = newContent.replace(originalUrl, newUrl);
    }
  }
  
  return newContent;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN MIGRATION
   ═══════════════════════════════════════════════════════════════════════════ */
async function migrate() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const maxPosts = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

  await connectDB();

  const headRes = await fetch(`${WP_BASE}/posts?per_page=1&page=1`);
  const totalPosts = parseInt(headRes.headers.get("X-WP-Total"), 10) || 0;
  const totalPages = parseInt(headRes.headers.get("X-WP-TotalPages"), 10) || 0;
  console.log(`\n📊 WordPress site has ${totalPosts} posts across ${totalPages} pages\n`);

  const postsToMigrate = Math.min(totalPosts, maxPosts);
  const pagesToFetch = Math.ceil(postsToMigrate / PER_PAGE);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (let page = 1; page <= pagesToFetch; page++) {
    console.log(`📄 Fetching page ${page}/${pagesToFetch}...`);

    let posts;
    try {
      posts = await fetchJSON(`${WP_BASE}/posts?per_page=${PER_PAGE}&page=${page}&_embed`);
    } catch (err) {
      console.error(`  ✗ Failed to fetch page ${page}: ${err.message}`);
      failed += PER_PAGE;
      continue;
    }

    for (const post of posts) {
      if (migrated + skipped >= postsToMigrate) break;

      try {
        const exists = await Article.findOne({ wpId: post.id });
        if (exists) {
          skipped++;
          continue;
        }

        const { parent, sub } = resolveCategory(post.categories || []);

        // 1. Handle Featured Image
        let imageUrl = "";
        try {
          const media = post._embedded?.["wp:featuredmedia"]?.[0];
          imageUrl = media?.source_url || "";
        } catch { imageUrl = ""; }

        if (!dryRun && imageUrl && imageUrl.includes(WP_DOMAIN)) {
          console.log(`  📸 Uploading featured image for: ${post.title.rendered.slice(0, 30)}...`);
          imageUrl = await uploadToCloudinary(imageUrl, `featured-${post.slug || post.id}`);
        }

        // 2. Handle Content Images
        let content = post.content?.rendered || "";
        if (!dryRun) {
          content = await migrateContentImages(content, post.slug, post.id);
        }

        const article = {
          title: decodeHtmlEntities(post.title?.rendered || "Untitled"),
          slug: post.slug || "",
          excerpt: stripHtml(post.excerpt?.rendered || ""),
          content: content,
          category: parent,
          subcategory: sub,
          image: imageUrl,
          author: "Sugar Times Team",
          premium: false,
          trending: false,
          status: post.status === "publish" ? "published" : "draft",
          wpId: post.id,
          createdAt: new Date(post.date),
          updatedAt: new Date(post.modified || post.date),
        };

        if (dryRun) {
          console.log(`  → [DRY] ${article.title.slice(0, 60)}`);
        } else {
          await Article.create(article);
        }
        migrated++;
      } catch (err) {
        console.error(`  ✗ Post ${post.id}: ${err.message}`);
        failed++;
      }
    }

    console.log(`  ✓ Page ${page} done (migrated: ${migrated}, skipped: ${skipped}, failed: ${failed})`);
    if (page < pagesToFetch) await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n═══════════════════════════════════════════════\n  Migration Complete${dryRun ? " (DRY RUN)" : ""}\n═══════════════════════════════════════════════\n  ✅ Migrated:  ${migrated}\n  ⏭️  Skipped:   ${skipped}\n  ❌ Failed:    ${failed}\n  📊 Total:     ${migrated + skipped + failed}\n═══════════════════════════════════════════════\n`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

