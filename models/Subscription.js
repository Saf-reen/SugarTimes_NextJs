import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Magazine plans
    plan: {
      type: String,
      enum: ["1year", "2year", "3year", "life", "monthly", "yearly"],
      required: true,
    },
    subscriptionType: {
      type: String,
      enum: ["print", "digital"],
      default: "digital",
    },
    // Dates
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    // Payment reference
    paymentId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    // Status
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "active",
    },
    // Subscriber personal details (from subscription form)
    subscriberName: String,
    designation: String,
    organisation: String,
    address: String,
    district: String,
    state: String,
    pincode: String,
    email: String,
    mobile: String,
    dateOfBirth: String,
    paymentMode: {
      type: String,
      enum: ["cash", "cheque", "online", "rtgs", ""],
      default: "",
    },
    chequeTransactionNo: String,
    dateOfPayment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
