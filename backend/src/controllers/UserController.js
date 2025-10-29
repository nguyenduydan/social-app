import { userService } from "../services/UserService.js";
import { createError } from "../lib/utils.js";

export const getMe = async (req, res, next) => {
    try {
        if (!req.user?._id) throw createError(404, "No userId");

        const user = await userService.getCurrentUser(req.user._id);
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) throw createError(404, "No userId");

        const user = await userService.getCurrentUser(userId);
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

export const getUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;

        if (!username) throw createError("Username is required", 400);

        const user = await userService.getUserByUsername(username);

        if (!user) throw createError("User not found", 404);

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};
export const updateUser = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { username, displayName, bio, phone, location, birthDay, linkSocialOther } = req.body;

        if (!userId) throw createError(400, "User ID is required");

        const userUpdated = await userService.updateInfo({
            id: userId,
            username,
            displayName,
            bio,
            phone,
            location,
            birthDay,
            linkSocialOther,
        });

        res.status(200).json({ user: userUpdated });
    } catch (error) {
        next(error);
    }
};

export const uploadAvatar = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const file = req.body;

        if (!userId) throw createError(404, "User ID not found");
        if (!file) throw createError(400, "No file uploaded");

        const userUpdated = await userService.updateAvatar({
            userId,
            file,
        });

        res.status(200).json({ user: userUpdated });
    } catch (error) {
        next(error);
    }
};

export const uploadCoverPhoto = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const file = req.body;

        if (!userId) throw createError(404, "User ID not found");
        if (!file) throw createError(400, "No file uploaded");

        const userUpdated = await userService.updateCoverPhoto({
            userId,
            file,
        });

        res.status(200).json({ user: userUpdated });
    } catch (error) {
        next(error);
    }
};

