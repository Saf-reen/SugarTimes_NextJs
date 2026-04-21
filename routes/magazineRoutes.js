import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import { getMagazines, createMagazine, deleteMagazine } from "../controllers/magazineController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "SugarTimes/magazines",
    resource_type: "auto" // Crucial for accepting both PDFs (raw) and Covers (image)
  },
});

const upload = multer({ storage });


// Optional auth — logged-in users get premium access if subscribed
router.get("/", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) return protect(req, res, next);
  next();
}, getMagazines);

// Handle file uploads: "file" is the PDF, "cover" is the image
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  createMagazine
);

// Delete magazine
router.delete("/:id", protect, adminOnly, deleteMagazine);

export default router;
