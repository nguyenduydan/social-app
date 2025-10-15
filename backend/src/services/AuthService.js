import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../lib/utils.js";
import { ENV } from "../config/env.js";
// import { sendWelcomeEmail } from "../utils/email.js";

export const createUser = async ({ displayName, email, password }) => {


    // Check trùng email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("Email already exists");
        error.status = 400;
        throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Tạo và lưu user
    const newUser = new User({
        displayName: displayName,
        email,
        password: hashedPass,
        role: "user"
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
        const error = new Error("Invalid user data");
        error.status = 400;
        throw error;
    }

    const accessToken = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);

    //TODO: Send mail welcome

    return { savedUser, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.status = 400;
        throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("Invalid Credentials");
        error.status = 400;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        const error = new Error("Invalid Credentials");
        error.status = 400;
        throw error;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken) => {
    const decoded = verifyToken(refreshToken, ENV.REFRESH_TOKEN_SECRET);
    if (!decoded) {
        const err = new Error("Invalid or expired refresh token");
        err.status = 401;
        throw err;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    const newAccessToken = generateAccessToken(user._id);
    return newAccessToken;
};

export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        const err = new Error("User not found", userId);
        err.status = 404;
        throw err;
    }
    return user;
};
