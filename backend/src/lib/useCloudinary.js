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
        if (!media) return;

        // Cho phép truyền string, object, hoặc array
        if (Array.isArray(media)) {
            await deleteMultipleOnCloudinary(media);
            return;
        }

        let public_id, resourceType, url;

        if (typeof media === "string") {
            public_id = media;
        } else if (typeof media === "object") {
            public_id = media.public_id || media.publicId;
            url = media.url;
            resourceType =
                media.type?.includes("video") || url?.includes("/video/")
                    ? "video"
                    : "image";
        }

        const cloudId = public_id || extractPublicId(url);
        if (!cloudId) {
            console.warn("⚠️ No valid Cloudinary ID found to delete:", media);
            return;
        }

        const result = await cloudinary.uploader.destroy(cloudId, {
            resource_type: resourceType || "image",
        });

        if (result.result === "ok") {
            console.log(`✅ Deleted ${resourceType || "image"}: ${cloudId}`);
        } else {
            console.warn(`⚠️ Delete result: ${result.result} (${cloudId})`);
        }
    } catch (error) {
        console.error("❌ Cloudinary delete failed:", error.message);
    }
};

/**
 * Xóa nhiều file Cloudinary song song
 */
export const deleteMultipleOnCloudinary = async (mediaList = []) => {
    if (!Array.isArray(mediaList) || mediaList.length === 0) return;

    const results = await Promise.allSettled(
        mediaList.map((item) => deleteOnCloudinary(item))
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
        console.warn(`⚠️ ${failed.length} Cloudinary deletions failed.`);
    }
};
