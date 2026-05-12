
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function check() {
  try {
    await connectDB();
    const count = await Article.countDocuments({ content: /By\s+[A-Z][a-z]+/ });
    console.log('Articles containing "By [Name]":', count);
    
    const samples = await Article.find({ content: /By\s+[A-Z][a-z]+/ }).limit(3);
    samples.forEach(s => console.log(`- ${s.title}\n  Content start: ${s.content.substring(0, 100)}\n`));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
