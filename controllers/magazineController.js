import Magazine from "../models/Magazine.js";
import Subscription from "../models/Subscription.js";
import path from "path";
import fs from "fs";

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
    const { title, accessType, pages } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    let fileUrl = null;
    let coverImage = null;

    // Multer populates req.files if files are uploaded
    if (req.files) {
      if (req.files.file && req.files.file.length > 0) {
        // Construct public URL for the PDF
        fileUrl = `/uploads/magazines/${req.files.file[0].filename}`;
      }
      if (req.files.cover && req.files.cover.length > 0) {
        // Construct public URL for the cover image
        coverImage = `/uploads/magazines/${req.files.cover[0].filename}`;
      }
    }

    const magazine = await Magazine.create({
      title,
      accessType: accessType || "free",
      pages: pages ? parseInt(pages, 10) : 48,
      fileUrl,
      coverImage
    });
    
    res.status(201).json(magazine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findByIdAndDelete(req.params.id);
    if (!magazine) return res.status(404).json({ message: "Magazine not found" });

    // Try to delete associated files from disk to clean up
    if (magazine.fileUrl) {
      const filePath = path.join(process.cwd(), magazine.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if (magazine.coverImage) {
      const coverPath = path.join(process.cwd(), magazine.coverImage);
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }

    res.json({ message: "Magazine deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
