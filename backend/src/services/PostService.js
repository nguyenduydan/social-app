import { uploadToCloudinary, deleteOnCloudinary, deleteMultipleOnCloudinary } from "../lib/useCloudinary.js";
import Post from "../models/Post.js";
import { createError } from "../lib/utils.js";
import User from "../models/User.js";
import { getPaginationMetadata, getPaginationParams } from "../lib/pagination.js";
import { compressVideo } from "../lib/mediaCompressor.js";

export const createPostService = async ({ userId, content, media = [], visibility = "friends" }) => {
    try {
        if (!userId) throw createError("User ID is required", 400);

        const uploadedMedia = await Promise.all(
            media.map(async (item) => {
                const { mimetype, buffer } = item;

                let processedBuffer = buffer;

                // Nén video nếu cần
                if (mimetype.startsWith("video/")) {
                    processedBuffer = await compressVideo(buffer);
                }

                // Chuyển buffer thành base64 để upload
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

        const newPost = new Post({
            author: userId,
            content,
            media: uploadedMedia,
            visibility,
        });

        const savedPost = await newPost.save();
        return savedPost;
    } catch (error) {
        console.error("❌ Error in createPostService:", error);
        throw createError(error.message || "Failed to create post", 500);
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
            // author: { $in: usersToInclude }, // toán tử so sánh trong MongoDB, dùng để kiểm tra xem giá trị của một trường có nằm trong một danh sách
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

export const updatePostService = async ({
    postId,
    userId,
    content,
    visibility,
    existingMedia = [],
    newMedia = [],
}) => {
    try {
        if (!postId) throw createError("Post ID is required", 400);
        if (!userId) throw createError("User ID is required", 400);

        // Tìm bài viết
        const post = await Post.findById(postId);
        if (!post) throw createError("Post not found", 404);

        // Kiểm tra quyền
        if (post.author.toString() !== userId.toString()) {
            throw createError("You are not authorized to edit this post", 403);
        }

        // Cập nhật nội dung và chế độ hiển thị
        if (content !== undefined) post.content = content;
        if (visibility !== undefined) post.visibility = visibility;

        // Xác định media bị xóa
        const removedMedia = post.media.filter(
            (m) => !existingMedia.includes(m._id.toString())
        );

        // Xóa media bị loại trên Cloudinary
        if (removedMedia.length > 0) {
            // console.log(`🗑️ Removing ${removedMedia.length} old media...`);
            await Promise.allSettled(
                removedMedia.map((m) => deleteOnCloudinary(m))
            );
        }

        // Giữ lại media còn dùng
        post.media = post.media.filter((m) =>
            existingMedia.includes(m._id.toString())
        );

        // Upload media mới
        if (newMedia.length > 0) {
            const uploadedMedia = await Promise.all(
                newMedia.map(async (item) => {
                    const { buffer, mimetype } = item;
                    let processedBuffer = buffer;

                    // Nén video nếu cần
                    if (mimetype.startsWith("video/")) {
                        processedBuffer = await compressVideo(buffer);
                    }

                    // Convert buffer → base64 → Cloudinary
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

            post.media.push(...uploadedMedia);
        }

        // Lưu và populate
        const updatedPost = await post.save();
        await updatedPost.populate("author", "displayName avatar");

        // console.log(`✅ Post ${postId} updated successfully`);
        return updatedPost;
    } catch (error) {
        console.error("❌ Error in updatePostService:", error);
        throw createError(error.message || "Failed to update post", 500);
    }
};

export const updatePostStatusService = async ({ postId, userId, visibility }) => {
    try {
        if (!postId) throw createError("Post ID is required", 400);
        if (!userId) throw createError("User ID is required", 400);
        if (!visibility) throw createError("Visibility is required", 400);

        const allowed = ["public", "friends", "private"];
        if (!allowed.includes(visibility)) {
            throw createError("Invalid visibility type", 400);
        }

        // Tìm post
        const post = await Post.findById(postId);
        if (!post) throw createError("Post not found", 404);

        // Kiểm tra quyền chỉnh sửa
        if (post.author.toString() !== userId.toString()) {
            throw createError("You are not authorized to update this post", 403);
        }

        // Cập nhật và lưu
        post.visibility = visibility;
        await post.save();

        return post;
    } catch (error) {
        console.error("❌ Error in deletePostService:", error);
        throw createError(
            error.message || "Failed to delete post",
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

        // Xóa media trên Cloudinary nếu có
        if (post.media?.length) {
            await deleteMultipleOnCloudinary(post.media);
        }

        // Xóa bài viết trong DB
        await Post.findByIdAndDelete(postId);

        console.log(`✅ Post ${postId} deleted successfully`);
        return { message: "Post deleted successfully" };
    } catch (error) {
        console.error("❌ Error in deletePostService:", error);
        throw createError(
            error.message || "Failed to delete post",
            error.status || 500
        );
    }
};
