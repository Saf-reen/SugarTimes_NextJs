import "dotenv/config";
import mongoose from "mongoose";
import Subscription from "./models/Subscription.js";

const now = new Date();

const testSubscriptions = [
  {
    userId: new mongoose.Types.ObjectId("69ce8817bebf53a512f98da3"),
    plan: "3year",
    subscriptionType: "print",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2028-06-01"),
    status: "active",
    subscriberName: "Rajesh Kumar",
    designation: "Chief Engineer",
    organisation: "Bajaj Hindusthan Sugar Ltd.",
    address: "45, Industrial Area, Lucknow, Uttar Pradesh",
    pincode: "226001",
    email: "rajesh.kumar@example.com",
    mobile: "+919876543210",
    dateOfBirth: "1978-03-15",
    paymentMode: "online",
  },
  {
    userId: new mongoose.Types.ObjectId("69d4a465249aadbb3bf4c14e"),
    plan: "1year",
    subscriptionType: "digital",
    startDate: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate() + 15),
    endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15),
    status: "active",
    subscriberName: "Priya Sharma",
    designation: "Research Analyst",
    organisation: "Dalmia Bharat Sugar Industries",
    address: "12, Sector 44, Noida, Uttar Pradesh",
    pincode: "201303",
    email: "priya.sharma@example.com",
    mobile: "+919988776655",
    dateOfBirth: "1990-07-22",
    paymentMode: "online",
  },
  {
    userId: new mongoose.Types.ObjectId("69d4b065249aadbb3bf4c248"),
    plan: "2year",
    subscriptionType: "print",
    startDate: new Date("2022-02-10"),
    endDate: new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()),
    status: "expired",
    subscriberName: "Amit Verma",
    designation: "Plant Manager",
    organisation: "Triveni Engineering & Industries",
    address: "78, Sugar Mill Road, Prayagraj, Uttar Pradesh",
    pincode: "211002",
    email: "amit.verma@example.com",
    mobile: "+918877665544",
    dateOfBirth: "1985-11-08",
    paymentMode: "cheque",
    chequeTransactionNo: "CHQ-445566",
  },
  {
    userId: new mongoose.Types.ObjectId("69ccb13ae6c6d2ac1b636361"),
    plan: "life",
    subscriptionType: "digital",
    startDate: new Date("2020-01-01"),
    endDate: new Date("2120-01-01"),
    status: "active",
    subscriberName: "Sunita Devi",
    designation: "Director",
    organisation: "Balrampur Chini Mills",
    address: "33, VIP Road, Kolkata, West Bengal",
    pincode: "700054",
    email: "sunita.devi@example.com",
    mobile: "+917766554433",
    dateOfBirth: "1972-05-30",
    paymentMode: "rtgs",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if test data already exists (idempotent)
    const existing = await Subscription.findOne({ email: "rajesh.kumar@example.com" });
    if (existing) {
      console.log("Test subscriptions already exist. Deleting old ones first...");
      const testEmails = testSubscriptions.map((s) => s.email);
      await Subscription.deleteMany({ email: { $in: testEmails } });
    }

    const result = await Subscription.insertMany(testSubscriptions);
    console.log(`Inserted ${result.length} test subscriptions:\n`);

    result.forEach((sub) => {
      const daysLeft = Math.ceil((sub.endDate - now) / (1000 * 60 * 60 * 24));
      console.log(
        `  ${sub.subscriberName.padEnd(16)} | ${sub.plan.padEnd(6)} | ${sub.subscriptionType.padEnd(7)} | ${sub.status.padEnd(8)} | ${daysLeft > 365 ? daysLeft + " days left" : daysLeft <= 0 ? "EXPIRED " + Math.abs(daysLeft) + "d ago" : daysLeft + " days left"}`
      );
      console.log(`    Mobile: ${sub.mobile} | Email: ${sub.email}`);
    });

    console.log("\n--- Test search values ---");
    console.log("Active (3yr):      mobile +919876543210  |  email rajesh.kumar@example.com");
    console.log("Expiring Soon:     mobile +919988776655  |  email priya.sharma@example.com");
    console.log("Expired:           mobile +918877665544  |  email amit.verma@example.com");
    console.log("Life Member:       mobile +917766554433  |  email sunita.devi@example.com");
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nDone.");
  }
}

seed();
