import { createPostService, deletePostService, getFeeds, getPostByIdService, updatePostService } from "../services/PostService.js";

export const getFeed = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(404).json({ message: "UserId not found" });
        const feeds = await getFeeds(userId, req.query);
        return res.status(200).json(feeds);
    } catch (error) {

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

        const newPost = await createPostService({
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

        const post = await getPostByIdService(postId);

        return res.status(200).json(post);
    } catch (error) {
        console.log("Error in getPostById: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params?.id;
        const userId = req.user?._id;
        const data = req.body;

        const updatedPost = await updatePostService(postId, userId, data);

        res.status(200).json({
            post: updatedPost,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Failed to update post",
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user?._id;

        const result = await deletePostService(postId, userId);

        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Failed to delete post",
        });
    }
};

