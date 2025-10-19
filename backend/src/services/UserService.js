import { createError } from "../lib/utils.js";
import User from "../models/User.js";

export const getCurrentUser = async (userId) => {
    try {
        if (!userId) {
            throw createError("User ID is required", 400);
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw createError("User not found", 404);
        }

        return user;

    } catch (error) {
        console.error("Error in getCurrentUser:", error.message);
        throw error.status ? error : createError(error.message || "Failed to get user");
    }
};
