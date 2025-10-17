import express from "express";
import { forgotPassword, getMe, login, logout, oauthCallback, refreshToken, resetPassword, signup, verifyResetCode } from "../controllers/AuthController.js";
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
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.patch("/reset-password", resetPassword);

export default router;
