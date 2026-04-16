import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: String,
  content: { type: String, required: true },
  category: { type: String, index: true },
  subcategory: { type: String, index: true },
  image: String,
  author: String,
  premium: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published"], default: "published" },
}, { timestamps: true });

articleSchema.index({ category: 1, subcategory: 1 });

export default mongoose.model("Article", articleSchema);
