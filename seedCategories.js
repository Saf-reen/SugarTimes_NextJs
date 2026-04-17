import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";

const CATEGORIES = [
  {
    name: "Sugar Industry",
    slug: "sugar-industry",
    emoji: "🏭",
    color: "from-emerald-500 to-teal-600",
    order: 0,
    children: [
      { name: "Sugar Mill News", slug: "sugar-mill-news", order: 0 },
      { name: "Policy", slug: "policy", order: 1 },
      { name: "Sugarcane Dept.", slug: "sugarcane-dept", order: 2 },
      { name: "Sugar Prices", slug: "sugar-prices", order: 3 },
    ],
  },
  {
    name: "Ethanol",
    slug: "ethanol",
    emoji: "🧪",
    color: "from-amber-500 to-orange-600",
    order: 1,
    children: [
      { name: "Blending News", slug: "blending-news", order: 0 },
      { name: "Distillery Projects", slug: "distillery-projects", order: 1 },
      { name: "ENA Trade", slug: "ena-trade", order: 2 },
      { name: "Biofuel Policy", slug: "biofuel-policy", order: 3 },
      { name: "Molasses", slug: "molasses", order: 4 },
      { name: "E20 Push", slug: "e20-push", order: 5 },
    ],
  },
  {
    name: "Farmer / किसान",
    slug: "farmer",
    emoji: "🌾",
    color: "from-lime-500 to-green-600",
    order: 2,
    children: [
      { name: "SAP / FRP Rates", slug: "sap-frp-rates", order: 0 },
      { name: "Cane Farming", slug: "cane-farming", order: 1 },
      { name: "AgriTech", slug: "agritech", order: 2 },
      { name: "Hindi News", slug: "hindi-news", order: 3 },
    ],
  },
  {
    name: "Market & Prices",
    slug: "market-prices",
    emoji: "📈",
    color: "from-sky-500 to-blue-600",
    order: 3,
    children: [
      { name: "Market Trends", slug: "market-trends", order: 0 },
      { name: "International Trade", slug: "international-trade", order: 1 },
      { name: "Export / Import", slug: "export-import", order: 2 },
    ],
  },
  {
    name: "Technology",
    slug: "technology",
    emoji: "🔬",
    color: "from-violet-500 to-purple-600",
    order: 4,
    children: [
      { name: "Research & Development", slug: "research-development", order: 0 },
      { name: "Conferences", slug: "conferences", order: 1 },
      { name: "Interviews", slug: "interviews", order: 2 },
    ],
  },
  {
    name: "Jaggery & Food",
    slug: "jaggery-food",
    emoji: "🍬",
    color: "from-rose-500 to-pink-600",
    order: 5,
    children: [
      { name: "Jaggery / Gur", slug: "jaggery-gur", order: 0 },
      { name: "Sugar & Health", slug: "sugar-health", order: 1 },
      { name: "Food Industry", slug: "food-industry", order: 2 },
      { name: "Lifestyle", slug: "lifestyle", order: 3 },
    ],
  },
];

async function seed() {
  await connectDB();

  // Clear existing categories
  await Category.deleteMany({});
  console.log("✓ Cleared old categories");

  for (const cat of CATEGORIES) {
    // Create parent
    const parent = await Category.create({
      name: cat.name,
      slug: cat.slug,
      emoji: cat.emoji,
      color: cat.color,
      order: cat.order,
      parent: null,
      active: true,
    });
    console.log(`✓ Created parent: ${parent.emoji} ${parent.name}`);

    // Create children
    for (const child of cat.children) {
      await Category.create({
        name: child.name,
        slug: child.slug,
        order: child.order,
        parent: parent._id,
        active: true,
      });
      console.log(`  └─ ${child.name}`);
    }
  }

  console.log("\n✅ All 6 categories with sub-categories seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
