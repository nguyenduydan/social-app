import { ENV } from "../config/env.js";
import { deleteOnCloudinary, uploadToCloudinary } from "../lib/useCloudinary.js";
import { createError } from "../lib/utils.js";
import User from "../models/User.js";

export class UserService {
    /**
     * Lấy thông tin người dùng hiện tại
     */
    async getCurrentUser(userId) {
        if (!userId) throw createError("User ID is required", 400);

        try {
            const user = await User.findById(userId).select("-password");
            if (!user) throw createError("User not found", 404);
            return user;
        } catch (error) {
            throw createError(error.message || "Failed to get user", error.status || 500);
        }
    }

    /**
     * Cập nhật thông tin cơ bản của người dùng
     */
    async updateInfo(data) {
        const {
            id,
            username,
            displayName,
            bio,
            phone,
            location,
            birthDay,
            linkSocialOther,
        } = data;

        try {
            const currentUser = await User.findById(id);
            if (!currentUser) throw createError("User not found", 404);

            // Check trùng username nếu có thay đổi
            if (username && username !== currentUser.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser) throw createError("Username đã tồn tại", 409);
            }

            // Tạo link cá nhân
            const personalLinkUsername = username || currentUser.username;
            const linkPersonal = `${ENV.CLIENT_URL}/profile/${personalLinkUsername}`;

            // Build fields update
            const updateFields = {
                ...(username && { username }),
                ...(displayName && { displayName }),
                ...(bio && { bio }),
                ...(phone && { phone }),
                ...(location && { location }),
                ...(birthDay && { birthDay }),
                linkPersonal,
                ...(linkSocialOther && { linkSocialOther }),
            };

            const userUpdated = await User.findByIdAndUpdate(id, updateFields, {
                new: true,
                runValidators: true,
            });

            return userUpdated;
        } catch (error) {
            throw createError(error.message || "Failed to update user", error.status || 500);
        }
    }

    /**
     * Cập nhật Avatar người dùng
     */
    async updateAvatar({ userId, file }) {
        if (!userId) throw createError("User ID is required", 400);
        if (!file) throw createError("Avatar image is required", 400);

        try {
            const user = await User.findById(userId);
            if (!user) throw createError("User not found", 404);

            // Xoá avatar cũ nếu có
            if (user.avatar?.publicId) {
                await deleteOnCloudinary(user.avatar);
            }

            // Upload avatar mới
            const fileData = typeof file === "string" ? file : file.avatar;
            const uploaded = await uploadToCloudinary(fileData, "avatars");

            if (!uploaded?.secure_url) {
                throw createError("Failed to upload image to Cloudinary", 500);
            }

            user.avatar = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id,
            };

            const updatedUser = await user.save();
            return updatedUser;
        } catch (error) {
            throw createError(error.message || "Failed to update avatar", error.status || 500);
        }
    }

    /**
     * Cập nhật ảnh bìa người dùng
     */
    async updateCoverPhoto({ userId, file }) {
        if (!userId) throw createError("User ID is required", 400);
        if (!file) throw createError("Cover photo image is required", 400);

        try {
            const user = await User.findById(userId);
            if (!user) throw createError("User not found", 404);

            // Xoá ảnh cũ trên Cloudinary nếu có
            if (user.coverPhoto?.publicId) {
                await deleteOnCloudinary(user.coverPhoto);
            }

            // Upload ảnh mới
            const fileData = typeof file === "string" ? file : file.coverPhoto;
            const uploaded = await uploadToCloudinary(fileData, "coverPhotos");

            if (!uploaded?.secure_url) {
                throw createError("Failed to upload cover photo to Cloudinary", 500);
            }

            user.coverPhoto = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id,
            };

            const updatedUser = await user.save();
            return updatedUser;
        } catch (error) {
            throw createError(error.message || "Failed to update cover photo", error.status || 500);
        }
    }
}

export const userService = new UserService();
