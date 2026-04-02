import mongoose from "mongoose";

const marketSchema = new mongoose.Schema({
  state: { type: String, required: true },
  commodity: String,
  price: { type: Number, required: true },
  unit: { type: String, default: "per quintal" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Market", marketSchema);
