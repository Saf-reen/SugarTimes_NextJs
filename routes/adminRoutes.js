import express from "express";
import { getDashboardStats, getMonthlyRevenue, getUsers, createUser, updateUser, deleteUser, getSubscriptions, getPayments, updateSubscription, deleteSubscription, getEnquiries, deleteEnquiry, updateEnquiryStatus } from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/monthly-revenue", getMonthlyRevenue);
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/subscriptions", getSubscriptions);
router.get("/payments", getPayments);
router.put("/subscriptions/:id", updateSubscription);
router.delete("/subscriptions/:id", deleteSubscription);
router.get("/enquiries", getEnquiries);
router.delete("/enquiries/:id", deleteEnquiry);
router.patch("/enquiries/:id/status", updateEnquiryStatus);

export default router;
