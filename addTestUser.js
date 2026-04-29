import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const addTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "nithin21091a05a5@gmail.com";
    const password = "user@123";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists. Updating password...");
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();
      console.log("Password updated successfully!");
    } else {
      console.log("Creating new user...");
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: "Test User",
        email: email,
        password: hashedPassword,
        mobile: "+910000000000",
        role: "user"
      });
      await newUser.save();
      console.log("User created successfully!");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error adding test user:", error);
    mongoose.connection.close();
  }
};

addTestUser();
