/**
 * Seed Test User
 * --------------
 * Adds a test user with phone +919490997946 for WhatsApp OTP login testing.
 * Run: node seedTestUser.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const TEST_USER = {
  name: "Test User",
  email: "kunjap76@gmail.com",
  mobile: "+919490997946",
  password: "Test@1234",        // default password (used for admin tab if needed)
  role: "user",
};

async function seedTestUser() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const existing = await User.findOne({
    $or: [{ email: TEST_USER.email }, { mobile: TEST_USER.mobile }],
  });

  if (existing) {
    // Update mobile if user exists but mobile was missing/different
    existing.mobile = TEST_USER.mobile;
    await existing.save();
    console.log(`⚡ User already exists — mobile updated to ${TEST_USER.mobile}`);
    console.log(`   Name  : ${existing.name}`);
    console.log(`   Email : ${existing.email}`);
    console.log(`   Mobile: ${existing.mobile}`);
    console.log(`   Role  : ${existing.role}`);
  } else {
    const hashed = await bcrypt.hash(TEST_USER.password, 10);
    const user = await User.create({ ...TEST_USER, password: hashed });
    console.log("🎉 Test user created successfully!");
    console.log(`   Name  : ${user.name}`);
    console.log(`   Email : ${user.email}`);
    console.log(`   Mobile: ${user.mobile}`);
    console.log(`   Role  : ${user.role}`);
  }

  await mongoose.disconnect();
  console.log("\n✅ Done. You can now test OTP login with +91 9490997946");
}

seedTestUser().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
