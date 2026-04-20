import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true }, // in paise (Razorpay unit)
    currency: { type: String, default: "INR" },
    // Razorpay fields
    razorpayOrderId: { type: String },         // order_id from Razorpay
    razorpayPaymentId: { type: String },       // payment_id after success
    razorpaySignature: { type: String },       // HMAC signature for verification
    // Legacy / fallback
    paymentId: { type: String },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    // Failure details
    failureReason: { type: String, default: null }, // Reason why payment was rejected
    failureCode: { type: String, default: null },   // Razorpay error code
    failedAt: { type: Date, default: null },        // When payment failed
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
