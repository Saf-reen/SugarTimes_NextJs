import express from "express";
import {
  getArticles, getArticleById, createArticle, updateArticle, deleteArticle,
} from "../controllers/articleController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", protect, adminOnly, createArticle);
router.put("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

export default router;
