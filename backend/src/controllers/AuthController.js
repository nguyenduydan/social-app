import { createUser, getCurrentUser, loginUser, refreshAccessToken } from "../services/AuthService.js";
import { validateSignup } from "../lib/validate.js";
import { attachAuthCookies, clearAuthCookies } from "../lib/utils.js";

export const signup = async (req, res) => {
    try {
        const { displayName, email, password } = req.body;

        validateSignup({ displayName, email, password });

        const { user, accessToken, refreshToken } = await createUser({ displayName, email, password });

        attachAuthCookies(res, accessToken, refreshToken);
        res.status(201).json({ user });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            message: error.message || "Internal server error",
        });
        console.log("Error in signup: ", error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { user, accessToken, refreshToken } = await loginUser({ email, password });

        attachAuthCookies(res, accessToken, refreshToken);
        res.status(200).json({ user });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            message: error.message || "Internal server error",
        });
        console.log("Error in login: ", error);
    }
};

export const logout = async (_, res) => {
    clearAuthCookies(res);
    res.status(200).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const newAccessToken = await refreshAccessToken(refreshToken);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: ENV.APP_ENV === "production",
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        console.log("Error in refreshToken: ", error);
    }
};

export const getMe = async (req, res) => {
    try {
        if (!req.user._id) return res.status(404).json({ message: "No userId" });
        const user = await getCurrentUser(req.user._id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        console.log("Error in getMe: ", error);
    }
};
