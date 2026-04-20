import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ token: generateToken(user), user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /auth/guest-register
 * Auto-creates a user account for guest subscription checkout.
 * If the email already exists, returns a message telling the user to log in.
 * Otherwise, generates a random password, creates the account, and returns
 * the token + generated password.
 */
export const guestRegister = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in first to continue with your subscription.",
        existingUser: true,
      });
    }

    // Generate a random 8-character password
    const crypto = await import("crypto");
    const generatedPassword = crypto.randomBytes(4).toString("hex"); // 8 hex chars

    const hashed = await bcrypt.hash(generatedPassword, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name, email, role: user.role },
      generatedPassword,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
