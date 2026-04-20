import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";

// Initialise Razorpay instance using env vars (secret stays server-side)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /payments/create-order
 * Creates a Razorpay order and stores a pending Payment record.
 * Body: { amount, currency }  — amount is in paise (multiply ₹ by 100)
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert ₹ to paise
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Store a pending payment record in DB
    const payment = await Payment.create({
      userId: req.user?.id,
      amount: options.amount,
      currency,
      razorpayOrderId: order.id,
      status: "pending",
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentDbId: payment._id,
      keyId: process.env.RAZORPAY_KEY_ID, // safe to expose key_id to frontend
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    res.status(500).json({ message: err.message || "Order creation failed" });
  }
};

/**
 * POST /payments/verify
 * Verifies Razorpay HMAC signature after successful payment.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    // HMAC-SHA256 verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch: mark payment as failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ message: "Payment verification failed: invalid signature" });
    }

    // Signature valid — update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentId: razorpay_payment_id,
        status: "success",
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    res.json({ success: true, paymentId: payment.paymentId, message: "Payment verified" });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).json({ message: err.message || "Verification failed" });
  }
};

/**
 * POST /payments/handle-failure
 * Handles rejected/failed payments from Razorpay
 * Body: { razorpay_order_id, error_code, error_description }
 */
export const handlePaymentFailure = async (req, res) => {
  try {
    const { razorpay_order_id, error_code, error_description } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ message: "Missing order ID" });
    }

    // Update payment record with failure details
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "failed",
        failureCode: error_code || "UNKNOWN",
        failureReason: error_description || "Payment was rejected by the payment gateway",
        failedAt: new Date(),
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    res.json({ 
      success: true, 
      message: "Payment failure recorded",
      paymentId: payment._id,
      reason: payment.failureReason
    });
  } catch (err) {
    console.error("Payment failure handling error:", err);
    res.status(500).json({ message: err.message || "Failed to record payment failure" });
  }
};
