import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";

const seedAdmin = async () => {
  await connectDB();

  const email = "sandalanithinkumar2@gmail.com";
  const password = "Nithin@2004";
  const name = "Admin";

  try {
    // Remove existing admin with the same email (in case of re-seed)
    await User.deleteOne({ email });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    console.log("✅ Admin user created successfully:");
    console.log(`   Email   : ${admin.email}`);
    console.log(`   Role    : ${admin.role}`);
    console.log(`   MongoDB ID: ${admin._id}`);
  } catch (err) {
    console.error("❌ Failed to seed admin:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
    process.exit(0);
  }
};

seedAdmin();
