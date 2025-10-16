import express from "express";
import { getMe, login, logout, oauthCallback, refreshToken, signup } from "../controllers/AuthController.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/oauth/callback",
    passport.authenticate("google", { session: false }),
    oauthCallback
);
router.post("/login", login);// Register new user
router.post("/signup", signup);// Login user
router.post("/logout", logout);// Logout user
router.post("/refresh-token", refreshToken);// Refresh access token
router.get("/me", protectRoute, getMe);// Get current user

export default router;
