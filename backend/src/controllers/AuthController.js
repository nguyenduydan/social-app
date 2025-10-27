import { authService } from "../services/AuthService.js";
import {
    attachAuthCookies,
    clearAuthCookies,
    generateResetCode,
} from "../lib/utils.js";
import { ENV } from "../config/env.js";
import sendResetCode from "../config/sendMail.js";
import passport from "passport";


const resetCodes = {}; // Dùng cho quên mật khẩu (lưu tạm code trong RAM)

// ===============================
// ĐĂNG KÝ NGƯỜI DÙNG
// ===============================
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const { accessToken, refreshToken } = await authService.register({
            firstName,
            lastName,
            email,
            password,
        });

        attachAuthCookies(res, accessToken, refreshToken);
        res.sendStatus(204); // ✅ Thành công, không trả data
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(error.status || 500).json({
            message: error.message || "Internal server error",
        });
    }
};

// ===============================
// ĐĂNG NHẬP
// ===============================
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email và mật khẩu không được để trống" });
        }

        const { user, accessToken, refreshToken } = await authService.signin({
            email,
            password,
        });

        attachAuthCookies(res, accessToken, refreshToken);
        res.status(200).json({ user, accessToken });
    } catch (error) {
        console.error("Error in signin:", error);
        res.status(error.status || 500).json({
            message: error.message || "Internal server error",
        });
    }
};

// ===============================
// ĐĂNG XUẤT
// ===============================
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken);
            clearAuthCookies(res);
        }
        res.sendStatus(204);
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(error.status || 500).json({
            message: error.message || "Internal server error",
        });
    }
};

// ===============================
// LÀM MỚI ACCESS TOKEN
// ===============================
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No token provided" });
        }

        const newAccessToken = await authService.refresh(refreshToken);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Error in refreshToken:", error);
        res.status(error.status || 500).json({ message: error.message });
    }
};

// ===============================
//  GOOGLE OAUTH CALLBACK
// ===============================
export const oauthCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user) => {
        if (err || !user) {
            console.error("Google OAuth failed:", err);
            return res.redirect(`${ENV.CLIENT_URL}/signin`);
        }

        const { accessToken, refreshToken } = await authService.oauthSignin({
            oauthUser: user,
        });
        attachAuthCookies(res, accessToken, refreshToken);

        return res.redirect(ENV.CLIENT_URL);
    })(req, res, next);
};

// ===============================
// QUÊN MẬT KHẨU - GỬI MÃ XÁC NHẬN
// ===============================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const resetCode = generateResetCode();

        resetCodes[email] = {
            code: resetCode,
            expiresAt: Date.now() + 60 * 1000, // 1 phút
        };

        await sendResetCode(email, resetCode);

        res.status(200).json({
            message: "Reset code sent to email",
            email,
        });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ error: "Failed to send reset code" });
    }
};

// ===============================
// XÁC MINH MÃ KHÔI PHỤC
// ===============================
export const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res
                .status(400)
                .json({ message: "Email and code are required" });
        }

        if (!resetCodes[email]) {
            return res.status(400).json({ message: "No reset request found" });
        }

        if (resetCodes[email].expiresAt < Date.now()) {
            delete resetCodes[email];
            return res.status(400).json({ message: "Reset code expired" });
        }

        if (resetCodes[email].code !== code) {
            return res.status(400).json({ message: "Invalid reset code" });
        }

        res.status(200).json({ message: "Code verified successfully" });
    } catch (error) {
        console.error("Error in verifyResetCode:", error);
        res.status(500).json({ error: "Failed to verify code" });
    }
};

// ===============================
// ĐẶT LẠI MẬT KHẨU
// ===============================
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const result = await authService.updatePassword(email, newPassword);
        delete resetCodes[email]; // clear code đã dùng
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(error.status || 500).json({ message: error.message });
    }
};
