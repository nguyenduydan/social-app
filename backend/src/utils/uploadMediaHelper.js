import { compressVideo } from "../utils/mediaCompressor.js";
import { uploadToCloudinary } from "./useCloudinary.js";

export const uploadMedia = (mediaList) => {
    if (!Array.isArray(mediaList) || mediaList.length === 0) return [];

    return Promise.all(
        mediaList.map(async (item) => {
            const { mimetype, buffer } = item;
            let processedBuffer = buffer;

            if (mimetype.startsWith("video/")) {
                processedBuffer = await compressVideo(buffer);
            }

            const base64 = processedBuffer.toString("base64");
            const dataUrl = `data:${mimetype};base64,${base64}`;
            const uploaded = await uploadToCloudinary(dataUrl, "social_media");

            return {
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
                type: uploaded.resource_type,
            };
        })
    );
};
