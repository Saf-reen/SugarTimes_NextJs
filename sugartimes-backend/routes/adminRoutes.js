import express from "express";
import { getDashboardStats, getUsers, updateSubscription } from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.put("/subscriptions/:id", updateSubscription);

export default router;
