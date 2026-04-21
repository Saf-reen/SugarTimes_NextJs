import express from "express";
import {
  getMarkets, addMarketData, updateMarketData, deleteMarketData,
} from "../controllers/marketController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getMarkets);
router.post("/", protect, adminOnly, addMarketData);
router.put("/:id", protect, adminOnly, updateMarketData);
router.delete("/:id", protect, adminOnly, deleteMarketData);

export default router;
