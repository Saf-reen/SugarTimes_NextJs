import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from "uuid";

// MOCK payment — replace with Razorpay/Stripe in production
export const initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentId = `PAY_${uuidv4()}`;
    const payment = await Payment.create({ userId: req.user.id, amount, paymentId, status: "pending" });
    res.json({ paymentId: payment.paymentId, amount, message: "Payment initiated (mock)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: "success" },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
