import Subscription from "../models/Subscription.js";

const PLAN_DURATION = { monthly: 30, yearly: 365 };

export const createSubscription = async (req, res) => {
  try {
    const { plan, paymentId } = req.body;
    const userId = req.user.id;

    const days = PLAN_DURATION[plan];
    if (!days) return res.status(400).json({ message: "Invalid plan" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    // Deactivate any existing subscription
    await Subscription.updateMany({ userId, status: "active" }, { status: "cancelled" });

    const subscription = await Subscription.create({ userId, plan, startDate, endDate, paymentId, status: "active" });
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
