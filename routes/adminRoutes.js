import express from "express";
import { getDashboardStats, getUsers, updateSubscription, getEnquiries, deleteEnquiry, updateEnquiryStatus } from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.put("/subscriptions/:id", updateSubscription);
router.get("/enquiries", getEnquiries);
router.delete("/enquiries/:id", deleteEnquiry);
router.patch("/enquiries/:id/status", updateEnquiryStatus);

export default router;
