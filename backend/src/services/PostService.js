import uploadToCloudinary from "../lib/uploadToCloudinary.js";
import Post from "../models/Post.js";
import { createError } from "../lib/utils.js";
import User from "../models/User.js";
import { getPaginationMetadata, getPaginationParams } from "../lib/pagination.js";

export const create = async (data) => {
    try {
        const { userId, content, media = [], visibility } = data;

        if ((!content || content.trim() === "") && (!media || media.length === 0)) {
            throw createError("Post must contain text or media", 400);
        }

        let uploadedMedia = [];

        if (media && media.length > 0) {
            // Upload tất cả media (image/video)
            uploadedMedia = await Promise.all(
                media.map(async (item) => {
                    const result = await uploadToCloudinary(item, "posts");
                    return {
                        url: result.secure_url,
                        type: result.resource_type === "video" ? "video" : "image",
                        publicId: result.public_id,
                    };
                })
            );
        }

        const newPost = new Post({
            author: userId,
            content,
            media: uploadedMedia,
            visibility: visibility || "friends",
        });

        const savedPost = await newPost.save();

        return savedPost;
    } catch (error) {
        console.error("Error in create post:", error);
        throw createError(error.message || "Failed to create post", error.status || 500);
    }
};

export const getFeeds = async (userId, query = {}) => {
    try {
        if (!userId) throw createError("User ID is required", 400);

        //Lấy danh sách following
        const user = await User.findById(userId).select("following");
        const usersToInclude = [userId, ...(user?.following || [])];

        //Xử lý pagination
        const { page, limit, skip } = getPaginationParams(query);

        //Lấy danh sách bài viết
        const posts = await Post.find({
            author: { $in: usersToInclude }, // toán tử so sánh trong MongoDB, dùng để kiểm tra xem giá trị của một trường có nằm trong một danh sách
            visibility: { $ne: "private" }, //Khác giá trị
        })
            .populate("author", "displayName avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Tính số lượng comment;
        const formattedPosts = posts.map(post => ({
            ...post,
            commentCount: post.comments?.length || 0, // chỉ lấy số lượng comment
            comments: undefined, // loại bỏ mảng comments để nhẹ hơn
            likeCount: post.likes?.length || 0,
        }));

        //Tổng số bài viết
        const total = await Post.countDocuments({
            author: { $in: usersToInclude },
            visibility: { $ne: "private" },
        });

        const metadata = getPaginationMetadata(total, page, limit);

        //Nếu không có bài viết
        if (!formattedPosts || formattedPosts.length === 0) {
            return {
                posts: [],
                pagination: metadata,
                message: "No posts found in your feed.",
            };
        }

        return {
            posts: formattedPosts,
            pagination: metadata,
        };
    } catch (error) {
        console.error("Error in getFeeds:", error);
        throw createError(error.message || "Failed to getFeeds", error.status || 500);
    }
};

export const getPostByIdService = async (postId) => {
    try {
        // Tìm bài viết theo ID + populate đầy đủ thông tin liên quan
        const post = await Post.findById(postId)
            .populate("author", "displayName avatar") // lấy tác giả
            .populate({
                path: "comments.user", // lấy user trong comment
                select: "displayName avatar", // chỉ lấy field cần thiết
            })
            .lean(); // chuyển thành object thuần JS

        if (!post) {
            throw createError("Post not found", 404);
        }

        post.commentCount = post.comments?.length || 0;
        post.likeCount = post.likes?.length || 0;

        return post;
    } catch (error) {
        console.error("Error in getPostById:", error);
        throw createError(error.message || "Failed to getPostById", error.status || 500);
    }
};

export const updatePostService = async (postId, userId, data) => {
    try {
        if (!postId) throw createError("Post ID is required", 400);
        if (!userId) throw createError("User ID is required", 400);

        // Tìm bài viết
        const post = await Post.findById(postId);
        if (!post) throw createError("Post not found", 404);

        // Kiểm tra quyền sở hữu
        if (post.author.toString() !== userId.toString()) {
            throw createError("You are not authorized to edit this post", 403);
        }

        // Cập nhật các trường được phép
        const allowedFields = ["content", "images", "visibility"];
        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                post[field] = data[field];
            }
        });

        const updatedPost = await post.save();

        // Populate lại author sau khi update
        await updatedPost.populate("author", "displayName avatar");

        return updatedPost;
    } catch (error) {
        console.error("Error in updatePostService:", error);
        throw createError(
            error.message || "Failed to update post",
            error.status || 500
        );
    }
};

export const deletePostService = async (postId, userId) => {
    try {
        if (!postId) throw createError("Post ID is required", 400);
        if (!userId) throw createError("User ID is required", 400);

        // Tìm bài viết
        const post = await Post.findById(postId);
        if (!post) throw createError("Post not found", 404);

        // Kiểm tra quyền
        if (post.author.toString() !== userId.toString()) {
            throw createError("You are not authorized to delete this post", 403);
        }

        // Xóa media trên Cloudinary (nếu có)
        if (post.media && post.media.length > 0) {
            for (const file of post.media) {
                if (file.publicId) {
                    try {
                        // Nếu là video → dùng resource_type: "video"
                        await cloudinary.uploader.destroy(file.publicId, {
                            resource_type: file.type === "video" ? "video" : "image",
                        });
                    } catch (err) {
                        console.warn(`⚠️ Failed to delete Cloudinary file: ${file.publicId}`);
                    }
                }
            }
        }

        // Xóa bài viết
        await Post.findByIdAndDelete(postId);
        return { message: "Post deleted successfully" };
    } catch (error) {
        console.error("Error in deletePostService:", error);
        throw createError(
            error.message || "Failed to delete post",
            error.status || 500
        );
    }
};
