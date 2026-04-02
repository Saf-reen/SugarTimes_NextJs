import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: String,
  category: { type: String, default: "General" }
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);
