import Magazine from "../models/Magazine.js";
import Subscription from "../models/Subscription.js";

export const getMagazines = async (req, res) => {
  try {
    const magazines = await Magazine.find().sort({ createdAt: -1 });
    // Hide fileUrl for premium if user has no active subscription
    const userId = req.user?.id;
    const activeSub = userId
      ? await Subscription.findOne({ userId, status: "active", endDate: { $gte: new Date() } })
      : null;

    const result = magazines.map((m) => {
      const obj = m.toObject();
      if (obj.accessType === "premium" && !activeSub) delete obj.fileUrl;
      return obj;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.create(req.body);
    res.status(201).json(magazine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
