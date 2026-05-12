
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function smartScan() {
  try {
    await connectDB();
    console.log("Connected to database for Smart Scan...");

    const articles = await Article.find({});
    console.log(`Scanning ${articles.length} articles...`);

    let updatedCount = 0;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (const article of articles) {
      let detectedName = null;

      // Pattern 1: Title starts with "Author "
      // Regex explained: matches "Author ", then captures everything until a verb or a separator
      const titleMatch = article.title.match(/^Author\s+([A-Z][^0-9,:\(\)\-]{3,})/i);
      if (titleMatch && titleMatch[1]) {
        let name = titleMatch[1].split(/\s+(?:Donates|Appointed|Writes|Says|States|Published|Launched|Clears|Paid|govt)/i)[0];
        detectedName = name.trim();
      }

      // Pattern 2: Content starts with "By [Name]"
      if (!detectedName) {
        const contentMatch = article.content.match(/^<p[^>]*>\s*By\s+([A-Z][^0-9,<]{3,})/i);
        if (contentMatch && contentMatch[1]) {
          let name = contentMatch[1].split(/[<,]/)[0].trim();
          // Check if it's a date
          const isDate = months.some(m => name.includes(m));
          if (!isDate) {
            detectedName = name;
          }
        }
      }

      // Pattern 3: Content starts with "Dr. [Name]"
      if (!detectedName) {
        const drMatch = article.content.match(/^<p[^>]*>\s*(Dr\.\s+[A-Z][a-z]+\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?)/i);
        if (drMatch && drMatch[1]) {
            detectedName = drMatch[1].trim();
        }
      }

      // Clean up the name
      if (detectedName) {
          detectedName = detectedName.replace(/[“”"']/g, "").trim();
          // Ensure it's not too long or too short
          if (detectedName.length < 5 || detectedName.length > 40) {
              detectedName = null;
          }
      }

      // If we found a name and it's different from the current contributorName
      if (detectedName && detectedName !== article.contributorName) {
        console.log(`Detected "${detectedName}" for: ${article.title.substring(0, 50)}...`);
        article.contributorName = detectedName;
        await article.save();
        updatedCount++;
      }
    }

    console.log(`\nSMART SCAN COMPLETE: Updated ${updatedCount} articles.`);
    process.exit(0);
  } catch (err) {
    console.error("Smart Scan failed:", err);
    process.exit(1);
  }
}

smartScan();
