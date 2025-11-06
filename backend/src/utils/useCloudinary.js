import cloudinary from "../config/cloudinary.js";
import pLimit from "p-limit";
import { log } from "./logger.js";

const limit = pLimit(5);

export const uploadToCloudinary = (fileData, folder = "uploads", mimetype) => {
    return new Promise((resolve, reject) => {
        const opts = {
            folder,
            resource_type: mimetype?.startsWith("video/") ? "video" : "image",
            transformation: [{ quality: "auto" }],
        };

        // Nếu là Buffer → upload_stream (nhanh hơn)
        if (Buffer.isBuffer(fileData)) {
            const stream = cloudinary.uploader.upload_stream(opts, (err, res) =>
                err ? reject(err) : resolve(res)
            );
            stream.end(fileData);
        } else {
            cloudinary.uploader
                .upload(fileData, opts)
                .then(resolve)
                .catch(reject);
        }
    });
};

const extractPublicId = (url) => {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
};

export const deleteOnCloudinary = async (media) => {
    try {
        if (!media) return;

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
            log.warn("⚠️ No valid Cloudinary ID found to delete:", media);
            return;
        }

        const result = await cloudinary.uploader.destroy(cloudId, {
            resource_type: resourceType || "image",
        });

        if (result.result === "ok") {
            log.info(`Deleted ${resourceType || "image"}: ${cloudId}`);
        } else {
            log.warn(`Delete result: ${result.result} (${cloudId})`);
        }
    } catch (error) {
        log.error(`Cloudinary delete failed: ${error.message}`);
    }
};

/**
 * Xóa nhiều file Cloudinary song song (có giới hạn)
 */
export const deleteMultipleOnCloudinary = async (mediaList = []) => {
    if (!Array.isArray(mediaList) || !mediaList.length) return;

    const tasks = mediaList.map((m) =>
        limit(() => deleteOnCloudinary(m))
    );

    const results = await Promise.allSettled(tasks);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
        log.warn(`${failed.length} Cloudinary deletions failed.`);
    }
};
