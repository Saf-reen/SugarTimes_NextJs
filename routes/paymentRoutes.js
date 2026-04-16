import express from "express";
import { createOrder, verifyPayment, handlePaymentFailure } from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a Razorpay order (returns order_id + key_id to frontend)
router.post("/create-order", protect, createOrder);

// Verify payment signature after Razorpay checkout completes
router.post("/verify", protect, verifyPayment);

// Handle payment failure/rejection from Razorpay
router.post("/handle-failure", handlePaymentFailure);

export default router;
