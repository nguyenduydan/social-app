import Post from "../models/Post.js";
import User from "../models/User.js";
import { createError } from "../../utils/AppError.js";
import {
    deleteMultipleOnCloudinary,
} from "../../utils/useCloudinary.js";
import { getPaginationMetadata, getPaginationParams } from "../../utils/pagination.js";
import { uploadMedia } from "../../utils/uploadMediaHelper.js";

const formatPosts = (posts) =>
    posts.map((post) => ({
        ...post,
        commentCount: post.comments?.length || 0,
        likeCount: post.likes?.length || 0,
        comments: undefined,
    }));

export const PostService = {
    async create({ userId, content, media = [], visibility = "friends" }) {
        if (!userId) throw createError("User ID is required", 400);

        try {
            // tạo trước bài post (trạng thái pending)
            const post = await Post.create({ author: userId, content, visibility, media: [] });

            // upload media ở background
            if (media.length) {
                uploadMedia(media)
                    .then(async (uploaded) => {
                        post.media = uploaded;
                        await post.save();
                    })
                    .catch((e) => log.error("Async upload failed:", e));
            }

            return post; // trả về ngay cho FE
        } catch (error) {
            throw createError(error.message || "Failed to create post", 500);
        }
    },

    async getFeeds(userId, query = {}) {
        try {
            const { page, limit, skip } = getPaginationParams(query);
            const user = await User.findById(userId)
                .select("friends following")
                .lean();

            if (!user) throw createError("User not found", 404);

            const visibleAuthors = [userId, ...(user.friends || []), ...(user.following || [])];

            const visibilityQuery = {
                $or: [
                    { visibility: "public" },
                    { visibility: "friends", author: { $in: visibleAuthors } },
                    { visibility: "private", author: userId },
                ],
            };

            // Fetch posts and total count in parallel
            const [posts, total] = await Promise.all([
                Post.find(visibilityQuery)
                    .populate("author", "displayName avatar username")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Post.countDocuments(visibilityQuery),
            ]);

            return {
                posts: formatPosts(posts),
                pagination: getPaginationMetadata(total, page, limit),
            };
        } catch (error) {
            throw createError(error.message || "Failed to get feeds", 500);
        }
    },

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

            return {
                ...post,
                commentCount: post.comments?.length || 0,
                likeCount: post.likes?.length || 0,
            };
        } catch (error) {
            throw createError(error.message || "Failed to get post", 500);
        }
    },

    async getPostByUserId(userId, query = {}) {
        try {
            const { page, limit, skip } = getPaginationParams(query);

            const filter = { author: userId };

            // Run queries in parallel
            const [posts, total] = await Promise.all([
                Post.find(filter)
                    .populate("author", "displayName avatar username")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Post.countDocuments(filter),
            ]);

            return {
                posts: formatPosts(posts),
                pagination: getPaginationMetadata(total, page, limit),
            };
        } catch (error) {
            throw createError(error.message || "Failed to get user posts", 500);
        }
    },

    async update({ postId, userId, content, visibility, existingMedia = [], newMedia = [] }) {
        if (!postId || !userId) throw createError("Post ID and User ID required", 400);

        try {
            const post = await Post.findById(postId);
            if (!post) throw createError("Post not found", 404);
            if (post.author.toString() !== userId.toString()) {
                throw createError("Unauthorized", 403);
            }

            if (content !== undefined) post.content = content;
            if (visibility !== undefined) post.visibility = visibility;

            // Remove deleted media
            const removedMedia = post.media.filter(
                (m) => !existingMedia.includes(m._id.toString())
            );
            if (removedMedia.length > 0) {
                await deleteMultipleOnCloudinary(removedMedia);
            }

            // Keep existing media
            post.media = post.media.filter((m) =>
                existingMedia.includes(m._id.toString())
            );

            // Add new media
            if (newMedia.length > 0) {
                const uploadedMedia = await uploadMedia(newMedia);
                post.media.push(...uploadedMedia);
            }

            const updatedPost = await post.save();
            await updatedPost.populate("author", "displayName avatar");

            return updatedPost;
        } catch (error) {
            throw createError(error.message || "Failed to update post", 500);
        }
    },

    async updateVisibility({ postId, userId, visibility }) {
        if (!postId || !userId || !visibility)
            throw createError("Missing parameters", 400);

        const allowed = ["public", "friends", "private"];
        if (!allowed.includes(visibility)) throw createError("Invalid visibility", 400);

        try {
            const post = await Post.findOneAndUpdate(
                { _id: postId, author: userId },
                { visibility },
                { new: true }
            ).lean();

            if (!post) throw createError("Post not found or unauthorized", 404);
            return post;
        } catch (error) {
            throw createError(error.message || "Failed to update visibility", 500);
        }
    },

    async delete(postId, userId) {
        if (!postId || !userId) throw createError("Missing parameters", 400);

        try {
            const post = await Post.findOneAndDelete({ _id: postId, author: userId }).lean();
            if (!post) throw createError("Post not found or unauthorized", 404);

            if (post.media?.length) await deleteMultipleOnCloudinary(post.media);

            return { message: "Post deleted successfully" };
        } catch (error) {
            throw createError(error.message || "Failed to delete post", 500);
        }
    },
};
