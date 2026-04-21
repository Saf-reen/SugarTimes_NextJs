import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import { uploadFile, getUploadedFiles, hideFile } from "../controllers/uploadController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "SugarTimes/articles",
    allowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
    // Cloudinary automatically handles the extension and public_id name.
  },
});

const upload = multer({ storage });

router.post("/", protect, adminOnly, upload.single("image"), uploadFile);
router.get("/", protect, adminOnly, getUploadedFiles);
router.delete("/:filename", protect, adminOnly, hideFile);

export default router;
