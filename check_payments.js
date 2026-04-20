import "dotenv/config";
import mongoose from "mongoose";
import Payment from "./models/Payment.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const successPayments = await Payment.find({ status: "success" });
  console.log(`Found ${successPayments.length} successful payments.`);

  let totalPaise = 0;
  for (const p of successPayments) {
    console.log(`Payment ID: ${p._id} | Amount (paise): ${p.amount} | Amount (INR): ₹${p.amount / 100} | Date: ${p.createdAt}`);
    totalPaise += p.amount;
  }

  console.log(`\nAggregate verification:`);
  console.log(`Total Paise: ${totalPaise}`);
  console.log(`Total INR: ₹${totalPaise / 100}`);

  process.exit(0);
}

run().catch(console.error);
