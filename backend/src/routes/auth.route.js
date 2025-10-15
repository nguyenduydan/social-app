import express from "express";
import { getMe, login, logout, refreshToken, signup } from "../controllers/AuthController.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);// Register new user
router.post("/signup", signup);// Login user
router.post("/logout", logout);// Logout user
router.post("/refresh-token", refreshToken);// Refresh access token
router.get("/me", protectRoute, getMe);// Get current user

export default router;
