import express from "express";
import { getMagazines, createMagazine } from "../controllers/magazineController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Optional auth — logged-in users get premium access if subscribed
router.get("/", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) return protect(req, res, next);
  next();
}, getMagazines);

router.post("/", protect, adminOnly, createMagazine);

export default router;
