// utils/uploadMediaHelper.js
import { compressVideo } from "./mediaCompressorCore.js";
import { uploadToCloudinary } from "./useCloudinary.js";
import pLimit from "p-limit";

const limit = pLimit(4); // tối đa 4 upload song song

export const uploadMedia = async (mediaList = []) => {
    if (!Array.isArray(mediaList) || mediaList.length === 0) return [];

    const uploads = await Promise.allSettled(
        mediaList.map((item) =>
            limit(async () => {
                const { mimetype, buffer } = item;
                let processed = buffer;

                if (mimetype.startsWith("video/")) {
                    processed = await compressVideo(buffer); // nén nhẹ
                }

                const uploaded = await uploadToCloudinary(processed, "social_media", mimetype);
                return {
                    url: uploaded.secure_url,
                    public_id: uploaded.public_id,
                    type: uploaded.resource_type,
                };
            })
        )
    );

    return uploads
        .filter((u) => u.status === "fulfilled")
        .map((u) => u.value);
};
