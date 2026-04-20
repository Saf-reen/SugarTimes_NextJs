import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadFile, getUploadedFiles, hideFile } from "../controllers/uploadController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads", "articles");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

router.post("/", protect, adminOnly, upload.single("image"), uploadFile);
router.get("/", protect, adminOnly, getUploadedFiles);
router.delete("/:filename", protect, adminOnly, hideFile);

export default router;
