import express from "express";
import { createOrder, verifyPayment, handlePaymentFailure } from "../controllers/paymentController.js";

const router = express.Router();

// All three routes must support guest checkout, so they are public. The
// controllers already use `req.user?.id` defensively and identify payment
// records by Razorpay's own order_id, which cannot be forged without the
// server-side key secret used for signature verification.
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.post("/handle-failure", handlePaymentFailure);

export default router;
