import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getMagazines, createMagazine, deleteMagazine } from "../controllers/magazineController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads", "magazines");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
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
