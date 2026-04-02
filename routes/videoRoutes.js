// import express from "express";
// import { getVideos, createVideo, deleteVideo } from "../controllers/videoController.js";
// import { auth } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/", getVideos);
// router.post("/", auth, admin, createVideo);
// router.delete("/:id", auth, admin, deleteVideo);

// export default router;


import express from "express";
import { getVideos, createVideo, deleteVideo } from "../controllers/videoController.js";
import auth from "../middleware/authMiddleware.js";  // ✅ default import

const router = express.Router();

router.get("/", getVideos);
router.post("/", auth, createVideo);     // ✅ removed admin
router.delete("/:id", auth, deleteVideo); // ✅ removed admin

export default router;