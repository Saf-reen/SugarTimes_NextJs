import express from "express";
import { 
  createSubscription, 
  getUserSubscription,
  searchSubscription,
  renewSubscription,
  updateSubscription
} from "../controllers/subscriptionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createSubscription);
router.get("/user/:userId", protect, getUserSubscription);
router.post("/search", searchSubscription);
router.post("/renew", renewSubscription);
router.put("/:id", protect, updateSubscription);

export default router;
