import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: String,
  image: String,
  author: String,
}, { timestamps: true });

export default mongoose.model("Article", articleSchema);
