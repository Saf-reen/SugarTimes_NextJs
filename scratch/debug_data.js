
import mongoose from "mongoose";
import "dotenv/config";
import Article from "../models/Article.js";
import Category from "../models/Category.js";

async function checkData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const articles = await Article.find().sort({ createdAt: -1 }).limit(5);
  console.log("--- LATEST ARTICLES ---");
  articles.forEach(a => {
    console.log(`Title: ${a.title}`);
    console.log(`Category: "${a.category}"`);
    console.log(`Subcategory: "${a.subcategory}"`);
    console.log("---");
  });

  const categories = await Category.find({ parent: null });
  console.log("--- PARENT CATEGORIES ---");
  categories.forEach(c => {
    console.log(`Name: "${c.name}"`);
  });

  process.exit(0);
}

checkData();
