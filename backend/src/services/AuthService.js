import User from "../models/User.js";
import Session from "../models/Session.js";
import {
    comparePassword,
    createError,
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
} from "../lib/utils.js";

const REFRESH_TOKEN_EXPIRE = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export class AuthService {
    /**
     * @desc Tạo người dùng mới
     */
    async register({ firstName, lastName, email, password }) {
        if (!email || !password || !firstName || !lastName) {
            throw createError("All fields are required", 400);
        }

        const existing = await User.findOne({ email });
        if (existing) {
            throw createError("Email already exists", 409);
        }

        const hashed = await hashPassword(password);

        const newUser = new User({
            displayName: `${firstName} ${lastName}`,
            email,
            password: hashed,
            role: "user",
        });

        const savedUser = await newUser.save();
        if (!savedUser) throw createError("Failed to create user", 400);

        const accessToken = generateAccessToken(savedUser._id);
        const refreshToken = generateRefreshToken(savedUser._id);

        return { user: savedUser, accessToken, refreshToken };
    }

    /**
     * @desc Đăng nhập người dùng
     */
    async signin({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
            throw createError("Email hoặc mật khẩu không đúng", 401);
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw createError("Email hoặc mật khẩu không đúng", 401);
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRE),
        });

        return { user, accessToken, refreshToken };
    }

    /**
     * @desc Đăng nhập OAuth (Google, Facebook,...)
     */
    async oauthSignin({ oauthUser }) {
        const accessToken = generateAccessToken(oauthUser._id);
        const refreshToken = generateRefreshToken(oauthUser._id);

        await Session.create({
            userId: oauthUser._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRE),
        });

        return { user: oauthUser, accessToken, refreshToken };
    }

    /**
     * @desc Đăng xuất người dùng
     */
    async logout(refreshToken) {
        if (!refreshToken) throw createError("Refresh token is required", 400);

        const result = await Session.deleteOne({ refreshToken });
        if (result.deletedCount === 0) {
            console.warn("⚠️ Session not found for logout");
        }

        return true;
    }

    /**
     * @desc Làm mới access token
     */
    async refresh(refreshToken) {
        if (!refreshToken) throw createError("Refresh token is required", 401);

        const session = await Session.findOne({ refreshToken });
        if (!session) throw createError("Invalid or expired refresh token", 403);

        if (session.expiresAt < new Date()) {
            throw createError("Token expired", 403);
        }

        const newAccessToken = generateAccessToken(session.userId);
        return newAccessToken;
    }

    /**
     * @desc Cập nhật mật khẩu
     */
    async updatePassword(email, newPassword) {
        if (!email || !newPassword) {
            throw createError("Email and password are required", 400);
        }

        if (newPassword.length < 6) {
            throw createError("Password must be at least 6 characters", 400);
        }

        const user = await User.findOne({ email });
        if (!user) throw createError("User not found", 404);

        const hashed = await hashPassword(newPassword);

        const updated = await User.findOneAndUpdate(
            { email },
            { password: hashed },
            { new: true }
        ).select("-password");

        if (!updated) throw createError("Failed to update password", 400);

        return {
            message: "Password updated successfully",
            user: {
                id: updated._id,
                email: updated.email,
                username: updated.username,
            },
        };
    }
}

export const authService = new AuthService();
