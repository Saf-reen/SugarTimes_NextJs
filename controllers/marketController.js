import Market from "../models/Market.js";

// Fields accepted from the admin form. Explicit so stray keys (like `_id`
// from an update payload) don't leak into Mongoose updates.
const MARKET_FIELDS = ["state", "commodity", "price", "minPrice", "maxPrice", "description", "unit", "date"];
const pickMarketPayload = (body) =>
  MARKET_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

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
    const entry = await Market.create(pickMarketPayload(req.body));
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMarketData = async (req, res) => {
  try {
    const entry = await Market.findByIdAndUpdate(
      req.params.id,
      pickMarketPayload(req.body),
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: "Market rate not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMarketData = async (req, res) => {
  try {
    const entry = await Market.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Market rate not found" });
    res.json({ message: "Market rate deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
