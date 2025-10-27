import Post from "../models/Post.js";
import { createError } from "../lib/utils.js";
import {
    uploadToCloudinary,
    deleteOnCloudinary,
    deleteMultipleOnCloudinary,
} from "../lib/useCloudinary.js";
import { getPaginationMetadata, getPaginationParams } from "../lib/pagination.js";
import { compressVideo } from "../lib/mediaCompressor.js";

export class PostService {
    async create({ userId, content, media = [], visibility = "friends" }) {
        if (!userId) throw createError("User ID is required", 400);

        try {
            const uploadedMedia = await this.#uploadMedia(media);

            const newPost = new Post({
                author: userId,
                content,
                media: uploadedMedia,
                visibility,
            });

            const savedPost = await newPost.save();
            return savedPost;
        } catch (error) {
            console.error("❌ Error in PostService.create:", error);
            throw createError(error.message || "Failed to create post", 500);
        }
    }

    async getFeeds(query = {}) {
        try {
            const { page, limit, skip } = getPaginationParams(query);

            const posts = await Post.find({
                visibility: { $ne: "private" },
            })
                .populate("author", "displayName avatar username")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const formattedPosts = posts.map((post) => ({
                ...post,
                commentCount: post.comments?.length || 0,
                likeCount: post.likes?.length || 0,
                comments: undefined,
            }));

            const total = await Post.countDocuments({
                visibility: { $ne: "private" },
            });

            const pagination = getPaginationMetadata(total, page, limit);

            return { posts: formattedPosts, pagination };
        } catch (error) {
            console.error("❌ Error in PostService.getFeeds:", error);
            throw createError(error.message || "Failed to get feeds", 500);
        }
    }

    async getById(postId) {
        try {
            const post = await Post.findById(postId)
                .populate("author", "displayName avatar")
                .populate({
                    path: "comments.user",
                    select: "displayName avatar",
                })
                .lean();

            if (!post) throw createError("Post not found", 404);

            post.commentCount = post.comments?.length || 0;
            post.likeCount = post.likes?.length || 0;

            return post;
        } catch (error) {
            console.error("❌ Error in PostService.getById:", error);
            throw createError(error.message || "Failed to get post", 500);
        }
    }

    async update({ postId, userId, content, visibility, existingMedia = [], newMedia = [] }) {
        if (!postId) throw createError("Post ID is required", 400);
        if (!userId) throw createError("User ID is required", 400);

        try {
            const post = await Post.findById(postId);
            if (!post) throw createError("Post not found", 404);
            if (post.author.toString() !== userId.toString()) {
                throw createError("You are not authorized to edit this post", 403);
            }

            // Cập nhật content / visibility
            if (content !== undefined) post.content = content;
            if (visibility !== undefined) post.visibility = visibility;

            // Xử lý media bị xóa
            const removedMedia = post.media.filter(
                (m) => !existingMedia.includes(m._id.toString())
            );
            if (removedMedia.length > 0) {
                await Promise.allSettled(removedMedia.map((m) => deleteOnCloudinary(m)));
            }

            // Giữ lại media còn dùng
            post.media = post.media.filter((m) =>
                existingMedia.includes(m._id.toString())
            );

            // Upload media mới
            if (newMedia.length > 0) {
                const uploadedMedia = await this.#uploadMedia(newMedia);
                post.media.push(...uploadedMedia);
            }

            const updatedPost = await post.save();
            await updatedPost.populate("author", "displayName avatar");

            return updatedPost;
        } catch (error) {
            console.error("❌ Error in PostService.update:", error);
            throw createError(error.message || "Failed to update post", 500);
        }
    }

    async updateVisibility({ postId, userId, visibility }) {
        if (!postId) throw createError("Post ID is required", 400);
        if (!userId) throw createError("User ID is required", 400);
        if (!visibility) throw createError("Visibility is required", 400);

        const allowed = ["public", "friends", "private"];
        if (!allowed.includes(visibility)) {
            throw createError("Invalid visibility type", 400);
        }

        try {
            const post = await Post.findById(postId);
            if (!post) throw createError("Post not found", 404);
            if (post.author.toString() !== userId.toString()) {
                throw createError("You are not authorized to update this post", 403);
            }

            post.visibility = visibility;
            await post.save();

            return post;
        } catch (error) {
            console.error("❌ Error in PostService.updateVisibility:", error);
            throw createError(error.message || "Failed to update post visibility", 500);
        }
    }

    async delete(postId, userId) {
        if (!postId) throw createError("Post ID is required", 400);
        if (!userId) throw createError("User ID is required", 400);

        try {
            const post = await Post.findById(postId);
            if (!post) throw createError("Post not found", 404);
            if (post.author.toString() !== userId.toString()) {
                throw createError("You are not authorized to delete this post", 403);
            }

            if (post.media?.length) {
                await deleteMultipleOnCloudinary(post.media);
            }

            await Post.findByIdAndDelete(postId);
            return { message: "Post deleted successfully" };
        } catch (error) {
            console.error("❌ Error in PostService.delete:", error);
            throw createError(error.message || "Failed to delete post", 500);
        }
    }

    // --------------------------
    // PRIVATE HELPER METHODS
    // --------------------------
    async #uploadMedia(mediaList) {
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
    }
}

// export instance sẵn để dùng ở controller
export const postService = new PostService();
