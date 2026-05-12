
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function check() {
  try {
    await connectDB();
    const art = await Article.findOne({ title: /Seema Saxena/ });
    console.log('TITLE:', art.title);
    console.log('CONTENT:', art.content.slice(0, 200));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
