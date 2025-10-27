import { ENV } from "../config/env.js";
import { deleteOnCloudinary, uploadToCloudinary } from "../lib/useCloudinary.js";
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

export const updateUserInfo = async (data) => {
    try {
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

        // Lấy user hiện tại
        const currentUser = await User.findById(id);
        if (!currentUser) {
            throw createError("User not found", 404);
        }

        // Nếu username thay đổi, check trùng
        if (username && username !== currentUser.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                throw createError("Username đã tồn tại", 409);
            }
        }

        // Tự động tạo link cá nhân dựa trên username (ưu tiên username mới nếu có)
        const personalLinkUsername = username || currentUser.username;
        const linkPersonal = `${ENV.CLIENT_URL}/profile/${personalLinkUsername}`;

        // Chỉ build các field có giá trị
        const updateFields = {
            ...(username !== undefined && { username }),
            ...(displayName !== undefined && { displayName }),
            ...(bio !== undefined && { bio }),
            ...(phone !== undefined && { phone }),
            ...(location !== undefined && { location }),
            ...(birthDay !== undefined && { birthDay }),
            linkPersonal,
            ...(linkSocialOther !== undefined && { linkSocialOther }),
        };

        // Cập nhật database
        const userUpdated = await User.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        return userUpdated;
    } catch (error) {
        console.error("Error in update:", error.message);
        throw error.status ? error : createError(error.message || "Failed to update user", 500);
    }
};

export const updateUserAvatar = async ({
    userId,
    file, // ảnh base64 từ FE
}) => {
    try {
        if (!userId) throw createError("User ID is required", 400);
        if (!file) throw createError("Avatar image is required", 400);

        // Tìm người dùng
        const user = await User.findById(userId);
        if (!user) throw createError("User not found", 404);

        // Xoá avatar cũ trên Cloudinary nếu có
        if (user.avatar?.publicId) {
            await deleteOnCloudinary(user.avatar);
        }

        //  Upload ảnh mới lên Cloudinary
        const fileData = typeof file === "string" ? file : file.avatar;
        const uploaded = await uploadToCloudinary(fileData, "avatars");

        if (!uploaded?.secure_url) {
            throw createError("Failed to upload image to Cloudinary", 500);
        }

        // Cập nhật thông tin người dùng trong DB
        user.avatar = {
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
        };

        const updatedUser = await user.save();

        // Trả kết quả
        return updatedUser;
    } catch (error) {
        console.error("❌ Error in updateUserAvatar:", error);
        throw createError(error.message || "Failed to update avatar", 500);
    }
};

export const updateUserCoverPhoto = async ({ userId, file }) => {
    try {
        if (!userId) throw createError("User ID is required", 400);
        if (!file) throw createError("Cover photo image is required", 400);

        // Lấy user hiện tại
        const user = await User.findById(userId);
        if (!user) throw createError("User not found", 404);

        // Xoá ảnh cover cũ nếu có
        if (user.coverPhoto?.publicId) {
            await deleteOnCloudinary(user.coverPhoto);
        }

        // Upload ảnh cover mới lên Cloudinary
        const fileData = typeof file === "string" ? file : file.coverPhoto;
        const uploaded = await uploadToCloudinary(fileData, "coverPhotos");

        if (!uploaded?.secure_url) {
            throw createError("Failed to upload cover photo to Cloudinary", 500);
        }

        // Cập nhật DB
        user.coverPhoto = {
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
        };

        const updatedUser = await user.save();

        return updatedUser;
    } catch (error) {
        console.error("❌ Error in updateUserCoverPhoto:", error);
        throw createError(error.message || "Failed to update cover photo", 500);
    }
};
