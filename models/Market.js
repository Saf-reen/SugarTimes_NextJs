import mongoose from "mongoose";

const marketSchema = new mongoose.Schema({
  state: { type: String, required: true },
  commodity: String,
  // `price` stays as the canonical "average / representative" price for
  // backward compatibility. `minPrice` and `maxPrice` are the admin-entered
  // range so the rate card can show a band instead of a single number.
  price: { type: Number, required: true },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  description: { type: String, default: "" },
  unit: { type: String, default: "per quintal" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Market", marketSchema);
