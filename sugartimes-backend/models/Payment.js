import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  paymentId: String,
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
