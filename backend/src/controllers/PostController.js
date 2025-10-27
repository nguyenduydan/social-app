import { postService } from "../services/PostService.js";

export const getFeed = async (req, res) => {
    try {
        const feeds = await postService.getFeeds(req.query);
        return res.status(200).json(feeds);
    } catch (error) {
        console.error("Error in getFeed:", error);
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const createPost = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { content, visibility } = req.body;
        const files = req.files || [];

        if (!userId) {
            return res.status(404).json({ message: "UserId not found" });
        }

        if ((!content || content.trim() === "") && files.length === 0) {
            return res.status(400).json({ message: "Post must contain text or media" });
        }

        // Chuẩn hóa media để service xử lý
        const media = files.map((file) => ({
            buffer: file.buffer,
            mimetype: file.mimetype,
            originalname: file.originalname,
        }));

        const newPost = await postService.create({
            userId,
            content,
            visibility,
            media,
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost:", error);
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        if (!postId) return res.status(404).json({ message: "PostId not found" });

        const post = await postService.getById(postId);

        return res.status(200).json(post);
    } catch (error) {
        console.log("Error in getPostById: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const userId = req.user?._id;
        const postId = req.params.id;
        const { content, visibility, existingMedia } = req.body;
        const files = req.files || [];

        if (!userId) {
            return res.status(404).json({ message: "UserId not found" });
        }

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Chuẩn hóa media mới để service xử lý
        const media = files.map((file) => ({
            buffer: file.buffer,
            mimetype: file.mimetype,
            originalname: file.originalname,
        }));

        const updatedPost = await postService.update({
            postId,
            userId,
            content,
            visibility,
            existingMedia: Array.isArray(existingMedia)
                ? existingMedia
                : existingMedia
                    ? [existingMedia]
                    : [],
            newMedia: media,
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in updatePost:", error);
        res
            .status(error.status || 500)
            .json({ message: error.message || "Internal server error" });
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const { postId, visibility } = req.body;

        const updatedPost = await postService.updateVisibility({
            postId,
            userId,
            visibility,
        });

        res.status(200).json({
            success: true,
            message: "Post visibility updated successfully",
            post: updatedPost,
        });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user?._id;

        const result = await postService.delete(postId, userId);

        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Failed to delete post",
        });
    }
};

