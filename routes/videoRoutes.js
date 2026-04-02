import express from "express";
import { getVideos, createVideo, deleteVideo } from "../controllers/videoController.js";
import { auth, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVideos);
router.post("/", auth, admin, createVideo);
router.delete("/:id", auth, admin, deleteVideo);

export default router;
