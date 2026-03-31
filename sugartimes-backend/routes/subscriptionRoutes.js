import express from "express";
import { createSubscription, getUserSubscription } from "../controllers/subscriptionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createSubscription);
router.get("/user/:userId", protect, getUserSubscription);

export default router;
