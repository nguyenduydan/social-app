import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import crypto from "crypto";

const { JWT_SECRET, REFRESH_TOKEN_SECRET, APP_ENV, JWT_EXPIRE, REFRESH_TOKEN_EXPIRE } = ENV;

// ACCESS TOKEN (ngắn hạn)
export const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// REFRESH TOKEN (dài hạn)
export const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });
};

// Verify JWT
export const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch {
        return null;
    }
};

// Gắn cookie an toàn
export const attachAuthCookies = (res, accessToken, refreshToken) => {
    const isProd = APP_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        sameSite: "strict",
        secure: isProd,
    };

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
};

// Xóa cookie khi logout
export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
};

export const generateResetCode = () => {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
};
