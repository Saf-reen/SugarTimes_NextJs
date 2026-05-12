
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";
import fs from "fs";
import path from "path";

async function generateSitemap() {
  try {
    await connectDB();
    console.log("Connected to DB for sitemap generation...");

    const articles = await Article.find({ status: "published" }).select("_id updatedAt");
    console.log(`Found ${articles.length} published articles.`);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sugartimes.co.in";
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Home
    xml += `  <url>\n    <loc>${siteUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    
    // News Hub
    xml += `  <url>\n    <loc>${siteUrl}/news</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    // Articles
    for (const article of articles) {
      const date = new Date(article.updatedAt || new Date()).toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/article/${article._id}</loc>\n`;
      xml += `    <lastmod>${date}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    // Write to the PUBLIC directory of the Next.js app
    const publicPath = path.resolve("../sugartimes/public/sitemap.xml");
    fs.writeFileSync(publicPath, xml);
    
    console.log(`\nSITEMAP GENERATED SUCCESSFULLY at: ${publicPath}`);
    process.exit(0);
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    process.exit(1);
  }
}

generateSitemap();
