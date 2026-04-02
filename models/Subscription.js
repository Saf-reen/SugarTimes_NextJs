import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, enum: ["monthly", "yearly"], required: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
  paymentId: String,
}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
