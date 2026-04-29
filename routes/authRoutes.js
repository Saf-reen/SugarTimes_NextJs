import express from "express";
import { register, login, guestRegister, sendEmailOtp, verifyEmailOtp } from "../controllers/authController.js";

const router = express.Router();
// ── Email OTP Login ───────────────────────────────────────────────────────────
router.post("/send-email-otp",   sendEmailOtp);    // Step 1: Check registration → send OTP via Email
router.post("/verify-email-otp", verifyEmailOtp);  // Step 2: Verify OTP → return JWT

// ── Legacy / Admin Routes ───────────────────────────────────────────────────
router.post("/register",       register);
router.post("/login",          login);
router.post("/guest-register", guestRegister);

export default router;
