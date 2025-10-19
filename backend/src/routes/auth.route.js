import express from "express";
import { forgotPassword, signin, logout, oauthCallback, refreshToken, resetPassword, signup, verifyResetCode } from "../controllers/AuthController.js";
import passport from "passport";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/oauth/callback",
    passport.authenticate("google", { session: false }),
    oauthCallback
);
router.post("/signin", signin);
router.post("/signup", signup);
router.post("/logout", logout);// Logout user
router.post("/refresh", refreshToken);// Refresh access token
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.patch("/reset-password", resetPassword);

export default router;
