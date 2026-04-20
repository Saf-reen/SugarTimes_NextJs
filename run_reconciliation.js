import "dotenv/config";
import mongoose from "mongoose";
import Payment from "./models/Payment.js";
import { razorpay } from "./controllers/paymentController.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const stalePayments = await Payment.find({
    status: "pending",
    createdAt: { $lt: tenMinutesAgo }
  });

  console.log(`Found ${stalePayments.length} stale pending payments.`);

  for (const p of stalePayments) {
    if (p.razorpayOrderId) {
      try {
        const order = await razorpay.orders.fetch(p.razorpayOrderId);
        if (order.status === "paid") {
          p.status = "success";
          p.paymentId = p.paymentId || p.razorpayPaymentId || order.receipt;
          console.log(`Recovered payment ${p._id}`);
        } else {
          p.status = "failed";
          p.failureReason = "Payment Timeout / Abandoned";
          p.failedAt = new Date();
          console.log(`Marked failed (abandoned): ${p._id}`);
        }
      } catch (err) {
        p.status = "failed";
        p.failureReason = "Payment Verification Failed";
        p.failedAt = new Date();
        console.log(`Marked failed (verification error): ${p._id}`);
      }
    } else {
      p.status = "failed";
      p.failureReason = "Payment Timeout";
      p.failedAt = new Date();
      console.log(`Marked failed (no Razorpay ID): ${p._id}`);
    }
    await p.save();
  }
  
  console.log("Done.");
  process.exit(0);
}

run().catch(console.error);
