import User from "../models/User.js";
import { comparePassword, createError, generateAccessToken, generateRefreshToken, hashPassword, verifyToken } from "../lib/utils.js";
import { ENV } from "../config/env.js";
import Session from "../models/Session.js";

const REFRESH_TOKEN_EXPIRE = 14 * 24 * 60 * 60 * 1000;

export const createUser = async (data) => {
    try {
        const { firstName, lastName, email, password } = data;

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            throw createError("All fields are required", 400);
        }

        // Check for existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw createError("Email already exists", 409);
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = new User({
            displayName: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            role: "user"
        });

        const savedUser = await newUser.save();
        if (!savedUser) {
            throw createError("Failed to create user", 400);
        }

        // Generate tokens
        const accessToken = generateAccessToken(savedUser._id);
        const refreshToken = generateRefreshToken(savedUser._id);

        // TODO: Send welcome email

        return { user: savedUser, accessToken, refreshToken };

    } catch (error) {
        console.error("Error in createUser:", error.message);
        throw error.status ? error : createError(error.message || "Failed to create user", 500);
    }
};

export const signinUser = async ({ email, password }) => {
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw createError("Email or password is not correct", 401);
        }

        // Compare passwords
        const isPasswordCorrect = await comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            throw createError("Email or password is not correct", 401);
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Create session
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRE)
        });

        return { user, accessToken, refreshToken };

    } catch (error) {
        console.error("Error in loginUser:", error.message);
        throw error.status ? error : createError(error.message || "Failed to login", 500);
    }
};

export const logoutUser = async (refreshToken) => {
    try {
        if (!refreshToken) {
            throw createError("Refresh token is required", 400);
        }

        const result = await Session.deleteOne({ refreshToken });

        if (result.deletedCount === 0) {
            console.warn("Session not found for logout");
        }

        return true;

    } catch (error) {
        console.error("Error in logoutUser:", error.message);
        throw createError(error.message || "Failed to logout", 500);
    }
};

export const refreshAccessToken = async (refreshToken) => {
    try {
        // So sánh với token trong DB
        const session = await Session.findOne({ refreshToken: refreshToken });
        if (!session) throw createError("Invalid or expired refresh token", 403);

        //Kiểm tra hết hạn chưa
        if (session.expiresAt < new Date()) {
            throw createError("Token expired", 403);
        }
        //tạo tokenAccess mới
        const newAccessToken = generateAccessToken(session.userId);
        //return
        return newAccessToken;

    } catch (error) {
        console.error("Error in refreshAccessToken:", error.message);
        throw error.status ? error : createError(error.message || "Failed to refresh token", 500);
    }
};

export const updatePassword = async (email, newPassword) => {
    try {
        // Validate input
        if (!email || !newPassword) {
            throw createError("Email and password are required", 400);
        }

        if (newPassword.length < 6) {
            throw createError("Password must be at least 6 characters", 400);
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            throw createError("User not found", 404);
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            throw createError("Failed to update password", 400);
        }

        return {
            message: "Password updated successfully",
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                username: updatedUser.username
            }
        };

    } catch (error) {
        console.error("Error in updatePassword:", error.message);
        throw error.status ? error : createError(error.message || "Failed to update password", 500);
    }
};
