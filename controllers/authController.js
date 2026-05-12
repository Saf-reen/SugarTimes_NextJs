import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createOtp, verifyOtp as checkOtp } from "../utils/otpStore.js";
import { sendOtpEmail, sendResetPasswordEmail } from "../utils/notificationService.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });


// ─── Email OTP Flow ───────────────────────────────────────────────────────────

export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        message: "This email is not registered. Please subscribe first.",
        notRegistered: true,
      });
    }

    // Generate OTP
    const { otp, cooldown, waitSeconds } = createOtp(normalizedEmail);
    if (cooldown) {
      return res.status(429).json({
        message: `Please wait ${waitSeconds} seconds before requesting another OTP.`,
        waitSeconds,
      });
    }

    // Send via Email
    const { success, error } = await sendOtpEmail(normalizedEmail, otp);
    if (!success) {
      return res.status(502).json({
        message: "Failed to send OTP email. Please try again.",
        detail: error,
      });
    }

    res.json({
      message: `OTP sent to your email (${normalizedEmail}).`,
      email: normalizedEmail,
    });
  } catch (err) {
    console.error("[sendEmailOtp]", err);
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP
    const { valid, reason } = checkOtp(normalizedEmail, String(otp).trim());
    if (!valid) {
      return res.status(401).json({ message: reason });
    }

    // OTP is valid — fetch user and issue token
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[verifyEmailOtp]", err);
    res.status(500).json({ message: err.message });
  }
};

// ─── Existing Routes (kept intact) ──────────────────────────────────────────

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name, email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /auth/guest-register
 * Auto-creates a user account for guest subscription checkout.
 */
export const guestRegister = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        message:
          "An account with this email already exists. Please log in first to continue with your subscription.",
        existingUser: true,
      });
    }

    const crypto = await import("crypto");
    const generatedPassword = crypto.randomBytes(4).toString("hex");

    const hashed = await bcrypt.hash(generatedPassword, 10);
    const user = await User.create({ name, email, password: hashed, mobile: mobile || "" });

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

    if (!user.password) {
      return res.status(400).json({ message: "This account was created without a password. Please contact support or reset your password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Password Reset Flow ──────────────────────────────────────────────────────

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "Account with this email not found." });
    }

    // Generate OTP using existing store
    const { otp, cooldown, waitSeconds } = createOtp(normalizedEmail);
    if (cooldown) {
      return res.status(429).json({
        message: `Please wait ${waitSeconds} seconds before requesting another OTP.`,
      });
    }

    // Send reset email
    const { success } = await sendResetPasswordEmail(normalizedEmail, otp);
    if (!success) {
      return res.status(502).json({ message: "Failed to send reset email." });
    }

    res.json({ message: "Reset code sent to your email.", email: normalizedEmail });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const { valid, reason } = checkOtp(normalizedEmail, String(otp).trim());
    if (!valid) return res.status(401).json({ message: reason });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Return a temporary token for the next step (Create Password)
    // We sign it with a shorter expiry (15m)
    const resetToken = jwt.sign(
      { id: user._id, purpose: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ message: "OTP verified.", resetToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.purpose !== "password_reset") {
      return res.status(401).json({ message: "Invalid or expired reset token." });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Update password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Reset session expired. Please start over." });
    }
    res.status(500).json({ message: err.message });
  }
};
