import Subscription from "../models/Subscription.js";

// Plan durations in days
const PLAN_DURATION = {
  "1year": 365,
  "2year": 730,
  "3year": 1095,
  life: 36500,   // ~100 years
  // legacy
  monthly: 30,
  yearly: 365,
};

/**
 * POST /subscriptions/create
 * Creates a subscription record after successful payment verification.
 */
export const createSubscription = async (req, res) => {
  try {
    const {
      plan,
      subscriptionType = "digital",
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      // Subscriber details from form
      subscriberName,
      designation,
      organisation,
      address,
      pincode,
      email,
      mobile,
      dateOfBirth,
      paymentMode,
      chequeTransactionNo,
      dateOfPayment,
    } = req.body;

    const userId = req.user.id;

    const days = PLAN_DURATION[plan];
    if (!days) return res.status(400).json({ message: `Invalid plan: ${plan}` });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    // Deactivate any existing active subscription for this user
    await Subscription.updateMany({ userId, status: "active" }, { status: "cancelled" });

    const subscription = await Subscription.create({
      userId,
      plan,
      subscriptionType,
      startDate,
      endDate,
      paymentId: paymentId || razorpayPaymentId,
      razorpayOrderId,
      razorpayPaymentId,
      status: "active",
      // Personal details
      subscriberName,
      designation,
      organisation,
      address,
      pincode,
      email,
      mobile,
      dateOfBirth,
      paymentMode,
      chequeTransactionNo,
      dateOfPayment,
    });

    res.status(201).json(subscription);
  } catch (err) {
    console.error("Create subscription error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /subscriptions/user/:userId
 * Returns the active subscription for a given user.
 */
export const getUserSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.params.userId,
      status: "active",
      endDate: { $gte: new Date() },
    });
    res.json(subscription || { status: "none" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /subscriptions/search
 * Search for subscription by memberNumber, mobile, or email (for renewal)
 */
export const searchSubscription = async (req, res) => {
  try {
    const { memberNumber, mobile, email } = req.body;

    if (!memberNumber && !mobile && !email) {
      return res.status(400).json({ message: "Provide memberNumber, mobile, or email" });
    }

    const query = {};
    if (memberNumber) query._id = memberNumber;
    if (mobile) {
      // Support 10-digit numbers without country code
      const digits = mobile.replace(/\D/g, "").slice(-10);
      query.mobile = { $regex: digits + "$" };
    }
    if (email) query.email = email;

    const subscription = await Subscription.findOne(query).populate("userId", "name email mobile");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const daysUntilExpiry = (new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24);
    const statusBadge =
      subscription.status !== "active" || daysUntilExpiry <= 0 ? "🔴 Expired" :
      daysUntilExpiry <= 30 ? "🟡 Expiring Soon" :
      "🟢 Active";

    res.json({
      _id: subscription._id,
      memberNumber: subscription._id,
      name: subscription.subscriberName || subscription.userId?.name,
      subscriptionType: subscription.subscriptionType,
      validUpto: subscription.endDate,
      deliveryAddress: subscription.address,
      registeredMobile: subscription.mobile,
      registeredEmail: subscription.email,
      status: statusBadge,
      statusCode: subscription.status,
      plan: subscription.plan,
      organisation: subscription.organisation,
      designation: subscription.designation,
    });
  } catch (err) {
    console.error("Search subscription error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /subscriptions/renew
 * Submit renewal request with plan and updated details
 */
export const renewSubscription = async (req, res) => {
  try {
    const {
      memberNumber,
      plan,
      subscriptionType,
      paymentMode,
      transactionNumber,
      razorpayOrderId,
      razorpayPaymentId,
      dateOfPayment,
      subscriberName,
      designation,
      organisation,
      address,
      pincode,
      email,
      mobile,
    } = req.body;

    if (!memberNumber || !plan) {
      return res.status(400).json({ message: "memberNumber and plan are required" });
    }

    const subscription = await Subscription.findById(memberNumber);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Calculate new end date from current end date (or today if expired)
    const renewalStartDate = subscription.endDate > new Date() ? subscription.endDate : new Date();
    const renewalEndDate = new Date(renewalStartDate);
    const days = PLAN_DURATION[plan];
    if (!days) {
      return res.status(400).json({ message: `Invalid plan: ${plan}` });
    }
    renewalEndDate.setDate(renewalEndDate.getDate() + days);

    // Update subscription with renewal details + Razorpay IDs
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      memberNumber,
      {
        plan,
        subscriptionType: subscriptionType || subscription.subscriptionType,
        endDate: renewalEndDate,
        status: "active",
        paymentMode: paymentMode || "online",
        chequeTransactionNo: transactionNumber || razorpayPaymentId,
        dateOfPayment,
        ...(razorpayOrderId && { razorpayOrderId }),
        ...(razorpayPaymentId && { razorpayPaymentId, paymentId: razorpayPaymentId }),
        ...(subscriberName && { subscriberName }),
        ...(designation && { designation }),
        ...(organisation && { organisation }),
        ...(address && { address }),
        ...(pincode && { pincode }),
        ...(email && { email }),
        ...(mobile && { mobile }),
      },
      { new: true }
    );

    res.json({
      message: "Renewal processed successfully",
      subscription: {
        memberNumber: updatedSubscription._id,
        name: updatedSubscription.subscriberName,
        newValidUpto: updatedSubscription.endDate,
        plan: updatedSubscription.plan,
        subscriptionType: updatedSubscription.subscriptionType,
      },
    });
  } catch (err) {
    console.error("Renew subscription error:", err);
    res.status(500).json({ message: err.message });
  }
};
