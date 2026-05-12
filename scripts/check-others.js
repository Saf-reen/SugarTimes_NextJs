
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function check() {
  try {
    await connectDB();
    const count = await Article.countDocuments({ author: { $ne: "Sugar Times Team" } });
    console.log(`Articles with author != "Sugar Times Team": ${count}`);
    
    if (count > 0) {
        const others = await Article.distinct("author", { author: { $ne: "Sugar Times Team" } });
        console.log("Other author names found:", others);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
