import express from "express";
import { 
  createSubscription, 
  getUserSubscription,
  searchSubscription,
  renewSubscription
} from "../controllers/subscriptionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createSubscription);
router.get("/user/:userId", protect, getUserSubscription);
router.post("/search", searchSubscription);
router.post("/renew", renewSubscription);

export default router;
