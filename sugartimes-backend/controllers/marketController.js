import Market from "../models/Market.js";

export const getMarkets = async (req, res) => {
  try {
    const { state, page = 1, limit = 20 } = req.query;
    const filter = state ? { state } : {};
    const data = await Market.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMarketData = async (req, res) => {
  try {
    const entry = await Market.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
