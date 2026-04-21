import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, index: true },
  excerpt: String,
  content: { type: String, required: true },
  category: { type: String, index: true },
  subcategory: { type: String, index: true },
  image: String,
  author: String,
  premium: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  showContributor: { type: Boolean, default: true },
  contributorName: { type: String, default: "" },
  contributorBio: { type: String, default: "" },
  status: { type: String, enum: ["draft", "published"], default: "published" },
  wpId: { type: Number, sparse: true, index: true },
}, { timestamps: true, strict: false, minimize: false });

articleSchema.index({ category: 1, subcategory: 1 });

export default mongoose.model("Article", articleSchema);
