import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
const BCRYPT_ROUNDS = 10;

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, APP_ENV, ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } = ENV;

// ACCESS TOKEN (ngắn hạn)
export const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
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
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        path: "/",
    };

    // res.cookie("accessToken", accessToken, {
    //     ...cookieOptions,
    //     maxAge: 15 * 60 * 1000, // 15 phút
    // });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 ngày
    });
};

// Xóa cookie khi logout
export const clearAuthCookies = (res) => {
    res?.clearCookie("accessToken");
    res?.clearCookie("refreshToken");
};

export const generateResetCode = () => {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
};

// Helper function to hash password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
};

// Helper function to compare passwords
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Helper function to create error
export const createError = (message, status = 500) => {
    const error = new Error(message);
    error.status = status;
    return error;
};


export const extractPublicId = (url) => {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
};
