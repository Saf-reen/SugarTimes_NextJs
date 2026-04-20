import express from "express";
import { register, login, guestRegister } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/guest-register", guestRegister);

export default router;
