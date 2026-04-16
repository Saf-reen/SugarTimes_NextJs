import express from "express";
import {
  getAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from "../controllers/advertisementController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAdvertisements);
router.post("/", protect, adminOnly, createAdvertisement);
router.put("/:id", protect, adminOnly, updateAdvertisement);
router.delete("/:id", protect, adminOnly, deleteAdvertisement);

export default router;
