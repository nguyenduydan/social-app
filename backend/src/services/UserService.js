import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../lib/uploadToCloudinary.js";
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
        const { id, displayName, bio, phone, avatar, coverPhoto } = data;

        // Build update object with only provided fields
        const updateFields = {
            ...(displayName !== undefined && { displayName }),
            ...(bio !== undefined && { bio }),
            ...(phone !== undefined && { phone }),
            ...(avatar !== undefined && { avatar }),
            ...(coverPhoto !== undefined && { coverPhoto })
        };

        // Get current user to handle image deletion
        const currentUser = await User.findById(id);
        if (!currentUser) {
            throw createError("User not found", 404);
        }

        // Handle avatar upload
        if (avatar) {
            // Delete old avatar from Cloudinary if exists
            if (currentUser.avatar?.publicId) {
                await cloudinary.uploader.destroy(currentUser.avatar.publicId);
            }

            // Upload new avatar
            const uploadedAvatar = await uploadToCloudinary(avatar, 'avatar');
            updateFields.avatar = {
                url: uploadedAvatar.secure_url,
                publicId: uploadedAvatar.public_id
            };
        }

        // Handle cover photo upload
        if (coverPhoto) {
            // Delete old cover photo from Cloudinary if exists
            if (currentUser.coverPhoto?.publicId) {
                await cloudinary.uploader.destroy(currentUser.coverPhoto.publicId);
            }

            // Upload new cover photo
            const uploadedCoverPhoto = await uploadToCloudinary(coverPhoto, 'coverPhoto');
            updateFields.coverPhoto = {
                url: uploadedCoverPhoto.secure_url,
                publicId: uploadedCoverPhoto.public_id
            };
        }

        // Update user in database
        const userUpdated = await User.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        return userUpdated;
    } catch (error) {
        console.error("Error in update:", error.message);
        throw error.status ? error : createError(error.message || "Failed to updater", 500);
    }
};

export const updateUserAvatar = async (data) => {
    try {
        const { id, file } = data;

        if (!id) {
            throw createError("User ID is required", 400);
        }

        // Get current user
        const currentUser = await User.findById(id);
        if (!currentUser) {
            throw createError("User not found", 404);
        }

        // Delete old avatar from Cloudinary if exists
        if (currentUser.avatar?.publicId) {
            await cloudinary.uploader.destroy(currentUser.avatar.publicId);
        }

        // Upload new avatar to Cloudinary
        const uploadedAvatar = await uploadToCloudinary(file, 'avatar');

        // Update user with new avatar
        const userUpdated = await User.findByIdAndUpdate(
            id,
            {
                avatar: {
                    url: uploadedAvatar.secure_url,
                    publicId: uploadedAvatar.public_id
                }
            },
            { new: true, runValidators: true }
        );

        return userUpdated;

    } catch (error) {
        console.error("Error in updateUserAvatar:", error.message);
        throw error.status ? error : createError(error.message || "Failed to upload avatar", 500);
    }
};

export const updateUserCoverPhoto = async (data) => {
    try {
        const { id, file } = data;

        if (!id) {
            throw createError("User ID is required", 400);
        }

        // Get current user
        const currentUser = await User.findById(id);
        if (!currentUser) {
            throw createError("User not found", 404);
        }

        // Delete old cover photo from Cloudinary if exists
        if (currentUser.coverPhoto?.publicId) {
            await cloudinary.uploader.destroy(currentUser.coverPhoto.publicId);
        }

        // Upload new cover photo to Cloudinary
        const uploadedCoverPhoto = await uploadToCloudinary(file, 'coverPhoto');

        // Update user with new cover photo
        const userUpdated = await User.findByIdAndUpdate(
            id,
            {
                coverPhoto: {
                    url: uploadedCoverPhoto.secure_url,
                    publicId: uploadedCoverPhoto.public_id
                }
            },
            { new: true, runValidators: true }
        );

        return userUpdated;

    } catch (error) {
        console.error("Error in updateUserCoverPhoto:", error.message);
        throw error.status ? error : createError(error.message || "Failed to upload cover photo", 500);
    }
};
