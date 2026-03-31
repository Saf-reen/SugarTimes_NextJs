import express from "express";
import { getMarkets, addMarketData } from "../controllers/marketController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getMarkets);
router.post("/", protect, adminOnly, addMarketData);

export default router;
