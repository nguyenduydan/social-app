import { userService } from "../services/UserService.js";

export const test = async (req, res) => {
    return res.sendStatus(204);
};

export const getMe = async (req, res) => {
    try {
        if (!req.user._id) return res.status(404).json({ message: "No userId" });
        const user = await userService.getCurrentUser(req.user._id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        console.log("Error in getMe: ", error);
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) return res.status(404).json({ message: "No userId" });

        const user = await userService.getCurrentUser(userId);
        res.status(200).json({ user });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        console.log("Error in getUser: ", error);
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { username, displayName, bio, phone, location, birthDay, linkSocialOther } = req.body;

        if (!userId) throw createError("User ID is required", 400);

        const userUpdated = await userService.updateInfo({
            id: userId,
            username,
            displayName,
            bio,
            phone,
            location,
            birthDay,
            linkSocialOther
        });

        res.status(200).json({
            user: userUpdated,
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        console.log("Error in updateUser: ", error);
    }
};
export const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user?._id;
        const file = req.body;
        if (!userId) {
            return res.status(404).json({ message: "User ID not found" });
        }

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Call update function for avatar
        const userUpdated = await userService.updateAvatar({
            userId,
            file: file
        });

        return res.status(200).json({
            user: userUpdated
        });

    } catch (error) {
        console.error("Error in uploadAvatar: ", error);
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const uploadCoverPhoto = async (req, res) => {
    try {
        const userId = req.user?._id;
        const file = req.body;

        if (!userId) {
            return res.status(404).json({ message: "User ID not found" });
        }

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Call update function for cover photo
        const userUpdated = await userService.updateCoverPhoto({
            userId: userId,
            file: file
        });

        return res.status(200).json({
            user: userUpdated
        });

    } catch (error) {
        console.error("Error in uploadCoverPhoto: ", error);
        res.status(error.status || 500).json({ message: error.message });
    }
};
