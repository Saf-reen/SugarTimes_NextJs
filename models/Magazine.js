import mongoose from "mongoose";

const magazineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  pages: { type: Number, default: 48 },
  fileUrl: String,
  coverImage: String,
  accessType: { type: String, enum: ["free", "premium"], default: "free" },
}, { timestamps: true });

export default mongoose.model("Magazine", magazineSchema);
