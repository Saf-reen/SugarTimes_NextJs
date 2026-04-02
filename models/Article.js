import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: String,
  content: { type: String, required: true },
  category: String,
  image: String,
  author: String,
  premium: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Article", articleSchema);
