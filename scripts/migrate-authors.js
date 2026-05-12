
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function migrate() {
  try {
    await connectDB();
    console.log("Connected to database for migration...");

    // Find articles where contributorName is empty, null, or missing
    const articles = await Article.find({
      $or: [
        { contributorName: "" },
        { contributorName: { $exists: false } },
        { contributorName: null }
      ]
    });

    console.log(`Found ${articles.length} articles to migrate.`);

    let count = 0;
    for (const article of articles) {
      // Use existing author field or fallback to default
      const targetName = (article.author && article.author.trim()) || "Sugar Times Team";
      
      article.contributorName = targetName;
      
      // Also ensure showContributor is true for legacy posts
      if (article.showContributor === undefined) {
        article.showContributor = true;
      }

      await article.save();
      count++;
      
      if (count % 100 === 0) {
        console.log(`Migrated ${count}/${articles.length} articles...`);
      }
    }

    console.log(`\nSUCCESS: Migrated ${count} articles.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
