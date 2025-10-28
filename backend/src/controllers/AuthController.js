import { authService } from "../services/AuthService.js";
import {
    attachAuthCookies,
    clearAuthCookies,
    generateResetCode,
} from "../lib/utils.js";
import { ENV } from "../config/env.js";
import sendResetCode from "../config/sendMail.js";
import passport from "passport";
import { createError } from "../lib/utils.js";

const resetCodes = {}; // Lưu tạm code quên mật khẩu trong RAM

// ===============================
// ĐĂNG KÝ NGƯỜI DÙNG
// ===============================
export const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!email || !password)
            throw createError("Email và mật khẩu là bắt buộc", 400);

        const { accessToken, refreshToken } = await authService.register({
            firstName,
            lastName,
            email,
            password,
        });

        attachAuthCookies(res, accessToken, refreshToken);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

// ===============================
// ĐĂNG NHẬP
// ===============================
export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw createError("Email và mật khẩu không được để trống", 400);

        const { user, accessToken, refreshToken } = await authService.signin({
            email,
            password,
        });

        attachAuthCookies(res, accessToken, refreshToken);
        res.status(200).json({ user, accessToken });
    } catch (error) {
        next(error);
    }
};

// ===============================
// ĐĂNG XUẤT
// ===============================
export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken);
            clearAuthCookies(res);
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

// ===============================
// LÀM MỚI ACCESS TOKEN
// ===============================
export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw createError("Không có token refresh", 401);

        const newAccessToken = await authService.refresh(refreshToken);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        next(error);
    }
};

// ===============================
// GOOGLE OAUTH CALLBACK
// ===============================
export const oauthCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user) => {
        try {
            if (err || !user) {
                console.error("Google OAuth failed:", err);
                return res.redirect(`${ENV.CLIENT_URL}/signin`);
            }

            const { accessToken, refreshToken } = await authService.oauthSignin({
                oauthUser: user,
            });
            attachAuthCookies(res, accessToken, refreshToken);

            return res.redirect(ENV.CLIENT_URL);
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};

// ===============================
// QUÊN MẬT KHẨU - GỬI MÃ XÁC NHẬN
// ===============================
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) throw createError("Email là bắt buộc", 400);

        const resetCode = generateResetCode();
        resetCodes[email] = {
            code: resetCode,
            expiresAt: Date.now() + 60 * 1000, // 1 phút
        };

        await sendResetCode(email, resetCode);

        res.status(200).json({
            message: "Mã xác nhận đã được gửi tới email",
            email,
        });
    } catch (error) {
        next(error);
    }
};

// ===============================
// XÁC MINH MÃ KHÔI PHỤC
// ===============================
export const verifyResetCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        if (!email || !code)
            throw createError("Cần cung cấp email và mã xác nhận", 400);

        const record = resetCodes[email];
        if (!record) throw createError("Không tìm thấy yêu cầu khôi phục", 400);

        if (record.expiresAt < Date.now()) {
            delete resetCodes[email];
            throw createError(400, "Mã xác nhận đã hết hạn");
        }

        if (record.code !== code)
            throw createError("Mã xác nhận không hợp lệ", 400);

        res.status(200).json({ message: "Mã hợp lệ" });
    } catch (error) {
        next(error);
    }
};

// ===============================
// ĐẶT LẠI MẬT KHẨU
// ===============================
export const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword)
            throw createError("Email và mật khẩu mới là bắt buộc", 400);

        const result = await authService.updatePassword(email, newPassword);
        delete resetCodes[email];
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
