
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function check() {
  try {
    await connectDB();
    const count = await Article.countDocuments({ title: /^Author/i });
    console.log('Articles starting with "Author":', count);
    
    const samples = await Article.find({ title: /^Author/i }).limit(5);
    samples.forEach(s => console.log("- ", s.title));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
