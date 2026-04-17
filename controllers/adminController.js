import User from "../models/User.js";
import Article from "../models/Article.js";
import Subscription from "../models/Subscription.js";
import Magazine from "../models/Magazine.js";
import Payment from "../models/Payment.js";
import Contact from "../models/Contact.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [users, articles, subscriptions, magazines, payments, paymentStats, ledgerStats] = await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
      Subscription.countDocuments({ status: "active" }),
      Magazine.countDocuments(),
      Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Payment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    const successfulAmount = payments[0]?.total || 0;

    res.json({
      totalUsers: users,
      totalArticles: articles,
      activeSubscriptions: subscriptions,
      totalMagazines: magazines,
      totalRevenue: successfulAmount,
      totalLedgerAmount: successfulAmount,
      successfulTxns: paymentStats.find(p => p._id === "success")?.count || 0,
      pendingTxns: paymentStats.find(p => p._id === "pending")?.count || 0,
      failedTxns: paymentStats.find(p => p._id === "failed")?.count || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMonthlyRevenue = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const pipeline = [
      { $match: { status: "success", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const result = await Payment.aggregate(pipeline);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const match = result.find((r) => r._id.year === year && r._id.month === month);
      data.push({
        month: monthNames[month - 1],
        revenue: match ? Math.round(match.total / 100) : 0,
        count: match ? match.count : 0,
      });
    }

    res.json(data);
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

export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = new User({
      name,
      email,
      role: role || "user",
      password: Math.random().toString(36).slice(-8) // Temporary password
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "", status, plan, subscriptionType } = req.query;
    let query = {};

    // Apply categorical filters
    if (status) query.status = status;
    if (plan) query.plan = plan;
    if (subscriptionType) query.subscriptionType = subscriptionType;

    // Apply search logic (subscriberName, email, mobile)
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { subscriberName: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { designation: searchRegex },
        { organisation: searchRegex }
      ];
    }

    const subscriptions = await Subscription.find(query)
      .populate("userId", "name email")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "", status } = req.query;
    let query = {};

    if (status) query.status = status;

    if (search) {
      const searchRegex = new RegExp(search, "i");
      // Search by transaction IDs or we can find matching users first
      // For simplicity/performance, let's search payment IDs and IDs directly
      query.$or = [
        { razorpayPaymentId: searchRegex },
        { razorpayOrderId: searchRegex },
        { paymentId: searchRegex }
      ];
      
      // Industrial level: find users and include their IDs in $or
      const matchingUsers = await User.find({ 
        $or: [{ name: searchRegex }, { email: searchRegex }] 
      }).select("_id");
      
      if (matchingUsers.length > 0) {
        query.$or.push({ userId: { $in: matchingUsers.map(u => u._id) } });
      }
    }

    const payments = await Payment.find(query)
      .populate("userId", "name email")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(payments);
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

export const deleteSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });
    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "", status } = req.query;
    let query = {};

    if (status && status !== "all") query.status = status;

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { contactNo: searchRegex },
        { subject: searchRegex },
        { commentsOrMessage: searchRegex }
      ];
    }

    const enquiries = await Contact.find(query)
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
