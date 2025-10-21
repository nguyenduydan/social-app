import cloudinary from "../config/cloudinary.js";
import { extractPublicId } from "./utils.js";

export const uploadToCloudinary = async (filePath, folder = "uploads") => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto", // ảnh hoặc video đều được
            eager: [{ quality: "auto", format: "mp4" }],
            eager_async: true
        });

        return result;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

export const deleteOnCloudinary = async (media) => {
    try {
        // Cho phép truyền string hoặc object
        let publicId, type, url;

        if (typeof media === "string") {
            publicId = media;
        } else if (Array.isArray(media)) {
            // Nếu là mảng -> xử lý từng phần tử
            for (const item of media) {
                await deleteOnCloudinary(item);
            }
            return;
        } else if (typeof media === "object" && media !== null) {
            ({ publicId, type, url } = media);
        }

        const cloudId = publicId || extractPublicId(url);

        if (!cloudId) {
            console.warn("⚠️ No valid Cloudinary ID found to delete:", media);
            return;
        }

        const resourceType =
            type?.includes("video") || url?.includes("/video/")
                ? "video"
                : "image";

        const result = await cloudinary.uploader.destroy(cloudId, {
            resource_type: resourceType,
        });

        if (result.result === "ok") {
            console.log(`✅ Deleted ${resourceType}: ${cloudId}`);
        } else {
            console.warn(`⚠️ Delete result: ${result.result} (${cloudId})`);
        }
    } catch (error) {
        console.error("❌ Cloudinary delete failed:", error.message);
    }
};

/**
 * 🗑️ Xoá nhiều file Cloudinary
 * @param {Array} mediaList - Danh sách media [{ publicId, type, url }]
 */
export const deleteMultipleOnCloudinary = async (mediaList = []) => {
    for (const media of mediaList) {
        await deleteOnCloudinary(media);
    }
};
