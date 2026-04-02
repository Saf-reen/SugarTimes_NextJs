import User from "../models/User.js";
import Article from "../models/Article.js";
import Subscription from "../models/Subscription.js";
import Magazine from "../models/Magazine.js";
import Payment from "../models/Payment.js";
import Contact from "../models/Contact.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [users, articles, subscriptions, magazines, payments] = await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
      Subscription.countDocuments({ status: "active" }),
      Magazine.countDocuments(),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    res.json({
      totalUsers: users,
      totalArticles: articles,
      activeSubscriptions: subscriptions,
      totalMagazines: magazines,
      totalRevenue: payments[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await User.find({}, "-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sub) return res.status(404).json({ message: "Subscription not found" });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const enquiries = await Contact.find()
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Contact.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["unread", "read", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const enquiry = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
