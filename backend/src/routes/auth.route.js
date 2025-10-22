import express from "express";
import { forgotPassword, signin, logout, oauthCallback, refreshToken, resetPassword, signup, verifyResetCode } from "../controllers/AuthController.js";
import passport from "passport";
import { ENV } from "../config/env.js";

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);
router.get("/oauth/callback", (req, res, next) => {
    if (req.query.error === "access_denied") {
        // Người dùng nhấn Hủy trên Google popup
        return res.redirect(`${ENV.CLIENT_URL}/signin`);
    }
    next();
}, oauthCallback);


router.post("/signin", signin);
router.post("/signup", signup);
router.post("/logout", logout);// Logout user
router.post("/refresh", refreshToken);// Refresh access token
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.patch("/reset-password", resetPassword);

export default router;
