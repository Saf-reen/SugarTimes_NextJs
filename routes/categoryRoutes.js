import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getCategories,
  getAllCategoriesFlat,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Public — tree structure for navbar / home page
router.get("/", getCategories);

// Admin — flat list with inactive categories
router.get("/all", protect, adminOnly, getAllCategoriesFlat);

// Admin CRUD
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
