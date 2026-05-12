
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function check() {
  try {
    await connectDB();
    const art = await Article.findOne({ title: /75% dues/ });
    console.log('CONTENT:', art.content.slice(0, 200));
    console.log('TITLE:', art.title);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
