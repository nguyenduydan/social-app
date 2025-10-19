import { createUser, signinUser, logoutUser, refreshAccessToken, updatePassword } from "../services/AuthService.js";
import { attachAuthCookies, clearAuthCookies, generateAccessToken, generateRefreshToken, generateResetCode } from "../lib/utils.js";
import { ENV } from "../config/env.js";
import sendResetCode from "../config/sendMail.js";

const resetCodes = {};

export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const { accessToken, refreshToken } = await createUser({ firstName, lastName, email, password });

        attachAuthCookies(res, accessToken, refreshToken);
        res.sendStatus(204); //created successfully but not send data
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            message: error.message || "Internal server error",
        });
        console.log("Error in signup: ", error);
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required " });
        }

        const { user, accessToken, refreshToken } = await signinUser({ email, password });

        attachAuthCookies(res, accessToken, refreshToken);

        res.status(200).json({ user, accessToken });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            message: error.message || "Internal server error",
        });
        console.log("Error in login: ", error);
    }
};

export const logout = async (req, res) => {
    try {
        const isRefreshToken = req.cookies?.refreshToken;

        if (isRefreshToken) {
            logoutUser(isRefreshToken);
            clearAuthCookies(res);
        }

        res.sendStatus(204);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            message: error.message || "Internal server error",
        });
        console.log("Error in logout: ", error);
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No token provided" });
        }
        const newAccessToken = await refreshAccessToken(refreshToken);

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        console.log("Error in refreshToken: ", error);
    }
};

export const oauthCallback = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${ENV.CLIENT_URL}/login`);
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Attach cookies
        attachAuthCookies(res, accessToken, refreshToken);

        // Redirect to frontend
        return res.redirect(ENV.CLIENT_URL);
    } catch (error) {
        console.error("Error in oauthCallback:", error);
        return res.redirect(`${ENV.CLIENT_URL}/login?error=oauth_failed`);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Generate 6-digit code
        const resetCode = generateResetCode();

        // Store code with expiration (1 minute)
        resetCodes[email] = {
            code: resetCode,
            expiresAt: Date.now() + 60 * 1000
        };

        // Send email with reset code
        await sendResetCode(email, resetCode);

        res.status(200).json({
            message: 'Reset code sent to email',
            email: email
        });

    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ error: 'Failed to send reset code' });
    }
};

export const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Email and code are required' });
        }

        // Check if code exists
        if (!resetCodes[email]) {
            return res.status(400).json({ message: 'No reset request found' });
        }

        // Check if expired
        if (resetCodes[email].expiresAt < Date.now()) {
            delete resetCodes[email];
            return res.status(400).json({ message: 'Reset code expired' });
        }

        // Check if code matches
        if (resetCodes[email].code !== code) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        res.status(200).json({ message: 'Code verified successfully' });

    } catch (error) {
        console.error('Error in verifyResetCode:', error);
        res.status(500).json({ error: 'Failed to verify code' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Update password
        const result = await updatePassword(email, newPassword);

        // Remove used code
        delete resetCodes[email];

        res.status(200).json(result);

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        console.log("Error in resetPassword: ", error);
    }
};
