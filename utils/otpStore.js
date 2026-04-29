import crypto from "crypto";

const store = new Map();

// OTP configurations
const OTP_LENGTH = 6;
const EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_DELAY_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;

/**
 * Generates and stores a 6-digit OTP for a given email.
 * Applies a 60-second cooldown to prevent spam.
 */
export function createOtp(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = store.get(normalizedEmail);

  if (existing) {
    const elapsed = Date.now() - existing.createdAt;
    if (elapsed < RESEND_DELAY_MS) {
      const waitSeconds = Math.ceil((RESEND_DELAY_MS - elapsed) / 1000);
      return { cooldown: true, waitSeconds };
    }
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const now = Date.now();

  store.set(normalizedEmail, {
    otp,
    createdAt: now,
    expiresAt: now + EXPIRY_MS,
    attempts: 0,
  });

  return { otp, cooldown: false };
}

/**
 * Validates the OTP for a given email.
 * Applies max attempt limits and expiration logic.
 */
export function verifyOtp(email, inputOtp) {
  const normalizedEmail = email.toLowerCase().trim();
  const record = store.get(normalizedEmail);

  if (!record) {
    return { valid: false, reason: "No OTP requested for this email." };
  }

  if (Date.now() > record.expiresAt) {
    store.delete(normalizedEmail);
    return { valid: false, reason: "OTP has expired. Please request a new one." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    store.delete(normalizedEmail);
    return { valid: false, reason: "Too many attempts. Please request a new OTP." };
  }

  if (record.otp !== String(inputOtp)) {
    record.attempts += 1;
    store.set(normalizedEmail, record);
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      valid: false,
      reason: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
    };
  }

  // OTP is valid - clear it so it can't be reused
  store.delete(normalizedEmail);
  return { valid: true };
}

/**
 * Periodically clean up expired OTPs from memory.
 */
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of store.entries()) {
    if (now > record.expiresAt) {
      store.delete(email);
    }
  }
}, 10 * 60 * 1000); // Run every 10 minutes
