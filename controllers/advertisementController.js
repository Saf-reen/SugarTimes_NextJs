import Advertisement from "../models/Advertisement.js";

const isActiveNow = (ad) => {
  const now = new Date();
  if (ad.startDate && new Date(ad.startDate) > now) return false;
  if (ad.endDate && new Date(ad.endDate) < now) return false;
  return ad.active !== false;
};

export const getAdvertisements = async (req, res) => {
  try {
    const { placement, category, activeOnly } = req.query;
    const filter = {};
    if (placement) {
      filter.$or = [{ placement }, { placement: "both" }];
    }
    if (category) {
      // Show an ad if: it targets this category OR has no category targeting (= all).
      filter.$and = (filter.$and || []).concat([
        { $or: [{ categories: category }, { categories: { $size: 0 } }] },
      ]);
    }
    let ads = await Advertisement.find(filter).sort({ priority: -1, createdAt: -1 });
    if (activeOnly === "true") ads = ads.filter(isActiveNow);
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.create(req.body);
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAdvertisement = async (req, res) => {
  try {
    await Advertisement.findByIdAndDelete(req.params.id);
    res.json({ message: "Advertisement deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
