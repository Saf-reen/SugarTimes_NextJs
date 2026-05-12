import express from "express";
import { 
  register, 
  login, 
  guestRegister, 
  sendEmailOtp, 
  verifyEmailOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();
// ── Email OTP Login ───────────────────────────────────────────────────────────
router.post("/send-email-otp",   sendEmailOtp);    // Step 1: Check registration → send OTP via Email
router.post("/verify-email-otp", verifyEmailOtp);  // Step 2: Verify OTP → return JWT

// ── Password Reset ────────────────────────────────────────────────────────────
router.post("/forgot-password",    forgotPassword);    // Step 1: Send reset OTP
router.post("/verify-reset-otp",   verifyResetOtp);    // Step 2: Verify reset OTP
router.post("/reset-password",      resetPassword);     // Step 3: Update password

// ── Legacy / Admin Routes ───────────────────────────────────────────────────
router.post("/register",       register);
router.post("/login",          login);
router.post("/guest-register", guestRegister);

export default router;
