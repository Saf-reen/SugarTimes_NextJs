
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function check() {
  try {
    await connectDB();
    const count = await Article.countDocuments({ wpId: { $exists: true } });
    console.log('Total articles with wpId:', count);
    
    if (count > 0) {
      const art = await Article.findOne({ wpId: { $exists: true } });
      console.log('Sample:', { title: art.title, wpId: art.wpId });
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
