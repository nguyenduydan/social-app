import Post from "../models/Post.js";
import User from "../models/User.js";
import { createError } from "../../utils/AppError.js";
import {
    uploadToCloudinary,
    deleteOnCloudinary,
    deleteMultipleOnCloudinary,
} from "../../utils/useCloudinary.js";
import { getPaginationMetadata, getPaginationParams } from "../../utils/pagination.js";
import { compressVideo } from "../../utils/mediaCompressor.js";
import { uploadMedia } from "../../utils/uploadMediaHelper.js";

export const PostService = {
    async create({ userId, content, media = [], visibility = "friends" }) {
        if (!userId) throw createError("User ID is required", 400);

        try {
            const uploadedMedia = await uploadMedia(media);

            const newPost = new Post({
                author: userId,
                content,
                media: uploadedMedia,
                visibility,
            });

            const savedPost = await newPost.save();
            return savedPost;
        } catch (error) {
            throw createError(error.message || "Failed to create post", 500);
        }
    },

    async getFeeds(userId, query = {}) {
        try {
            const { page, limit, skip } = getPaginationParams(query);

            // --- Lấy danh sách bạn bè và người đang theo dõi ---
            const user = await User.findById(userId)
                .select("friends following")
                .lean();

            if (!user) {
                throw createError("User not found", 404);
            }

            const visibleAuthors = [
                userId,
                ...(user.friends || []),
                ...(user.following || []),
            ];

            // --- Truy vấn bài viết theo quyền xem ---
            const posts = await Post.find({
                $or: [
                    // Bài public ai cũng thấy
                    { visibility: "public" },

                    // Bài friends: chỉ hiển thị nếu là bạn hoặc follow
                    {
                        $and: [
                            { visibility: "friends" },
                            { author: { $in: visibleAuthors } },
                        ],
                    },

                    // Bài private: chỉ chính chủ thấy
                    {
                        $and: [
                            { visibility: "private" },
                            { author: userId },
                        ],
                    },
                ],
            })
                .populate("author", "displayName avatar username")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            // --- Định dạng dữ liệu ---
            const formattedPosts = posts.map((post) => ({
                ...post,
                commentCount: post.comments?.length || 0,
                likeCount: post.likes?.length || 0,
                comments: undefined,
            }));

            // --- Tổng số bài hợp lệ ---
            const total = await Post.countDocuments({
                $or: [
                    { visibility: "public" },
                    {
                        $and: [
                            { visibility: "friends" },
                            { author: { $in: visibleAuthors } },
                        ],
                    },
                    {
                        $and: [
                            { visibility: "private" },
                            { author: userId },
                        ],
                    },
                ],
            });

            const pagination = getPaginationMetadata(total, page, limit);

            return { posts: formattedPosts, pagination };
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

            post.commentCount = post.comments?.length || 0;
            post.likeCount = post.likes?.length || 0;

            return post;
        } catch (error) {
            throw createError(error.message || "Failed to get post", 500);
        }
    },

    async getPostByUserId(userId, query = {}) {
        try {
            const { page, limit, skip } = getPaginationParams(query);

            // const visibilityFilter = ["public"];
            // if (isFriend) visibilityFilter.push("friends");

            const posts = await Post.find({
                author: userId,
                // visibility: { $in: visibilityFilter },
            }).populate("author", "displayName avatar username")
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

            const total = await Post.countDocuments();

            const pagination = getPaginationMetadata(total, page, limit);

            return { posts: formattedPosts, pagination };
        } catch (error) {
            throw createError(error.message || "Failed to get post", 500);
        }
    },

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
            throw createError(error.message || "Failed to update post visibility", 500);
        }
    },

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
            throw createError(error.message || "Failed to delete post", 500);
        }
    },
};

