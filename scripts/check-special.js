
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import connectDB from "../config/db.js";

async function check() {
  try {
    await connectDB();
    const art = await Article.findOne({ author: { $ne: "Sugar Times Team" } });
    console.log(JSON.stringify(art, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
