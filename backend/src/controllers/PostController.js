// controllers/postController.js
import { postService } from "../services/PostService.js";
import { createError } from "../lib/utils.js";

export const getFeed = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const feeds = await postService.getFeeds(userId, req.query);
        res.status(200).json(feeds);
    } catch (error) {
        next(error);
    }
};

export const createPost = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) throw createError("UserId not found", 404);

        const { content, visibility } = req.body;
        const files = req.files || [];

        // chuẩn hóa media
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
        next(error);
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) throw createError("Post ID is required", 400);

        const post = await postService.getById(postId);
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

export const getPostByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user._id;
        const query = req.query;
        if (!userId) throw createError("UserId is not found");

        const posts = await postService.getPostByUserId(userId, query);
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const postId = req.params.id;
        if (!userId) throw createError("User ID not found", 404);
        if (!postId) throw createError("Post ID is required", 400);

        const { content, visibility, existingMedia } = req.body;
        const files = req.files || [];

        const newMedia = files.map((file) => ({
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
            newMedia,
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
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

export const deletePost = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { id: postId } = req.params;

        const result = await postService.delete(postId, userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
