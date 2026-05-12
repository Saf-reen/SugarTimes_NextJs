
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function check() {
  try {
    await connectDB();
    const authors = await Article.distinct("author");
    console.log("\n--- UNIQUE AUTHORS IN DATABASE ---");
    console.log(authors);
    
    const contributorNames = await Article.distinct("contributorName");
    console.log("\n--- UNIQUE CONTRIBUTOR NAMES IN DATABASE ---");
    console.log(contributorNames);
    console.log("\n----------------------------------\n");
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
