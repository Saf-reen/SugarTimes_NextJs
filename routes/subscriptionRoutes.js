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

// Public: createSubscription auto-registers guest users from name/email in the
// body and uses `req.user?.id` defensively, so a JWT is not required here.
router.post("/create", createSubscription);
router.get("/user/:userId", protect, getUserSubscription);
router.post("/search", searchSubscription);
router.post("/renew", renewSubscription);
router.put("/:id", protect, updateSubscription);

export default router;
