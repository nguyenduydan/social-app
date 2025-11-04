import { createError } from "../utils/AppError.js";
import { FriendService } from "../services/FriendService.js";

/**
 * Gửi lời mời kết bạn
 * POST /api/friends/requests
 * Body: { to: userId, message?: string }
 */
export const sendRequest = async (req, res, next) => {
    try {
        const from = req.user._id;
        const { to, message } = req.body;

        if (!to) {
            throw createError("Recipient ID is required", 400);
        }

        if (from.toString() === to.toString()) {
            throw createError("Cannot send friend request to yourself", 400);
        }

        const result = await FriendService.sendFriendRequest(from, to, message);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Chấp nhận lời mời kết bạn
 * PUT /api/friends/requests/:requestId/accept
 * Note: requestId là ID của FriendRequest, không phải Friend
 */
export const acceptRequest = async (req, res, next) => {
    try {
        const recipientId = req.user._id;
        const { requestId } = req.params;

        if (!requestId) {
            throw createError("Request ID is required", 400);
        }

        const result = await FriendService.acceptFriendRequest(requestId, recipientId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Từ chối lời mời kết bạn
 * PUT /api/friends/requests/:requestId/reject
 */
export const rejectRequest = async (req, res, next) => {
    try {
        const recipientId = req.user._id;
        const { requestId } = req.params;

        if (!requestId) {
            throw createError("Request ID is required", 400);
        }

        const result = await FriendService.rejectFriendRequest(requestId, recipientId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Hủy lời mời đã gửi
 * DELETE /api/friends/requests/:requestId/cancel
 */
export const cancelRequest = async (req, res, next) => {
    try {
        const senderId = req.user._id;
        const { requestId } = req.params;

        if (!requestId) {
            throw createError("Request ID is required", 400);
        }

        const result = await FriendService.cancelFriendRequest(requestId, senderId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Xóa bạn bè (unfriend)
 * DELETE /api/friends/:friendshipId
 * Note: friendshipId là ID của Friend record
 */
export const removeFriend = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const { friendshipId } = req.params;

        if (!friendshipId) {
            throw createError("Friendship ID is required", 400);
        }

        const result = await FriendService.removeFriendById(friendshipId, currentUserId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Lấy danh sách bạn bè
 * GET /api/friends
 * Query: page, limit, search
 */
export const getAllFriends = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const query = req.query;

        const result = await FriendService.getAllFriends(userId, query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Lấy danh sách lời mời kết bạn
 * GET /api/friends/requests
 * Query: page, limit, type (received/sent)
 */
export const getFriendRequests = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const query = req.query;

        const result = await FriendService.getFriendRequests(userId, query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Gợi ý kết bạn cơ bản
 * GET /api/friends/suggestions
 * Query: limit
 */
export const getFriendSuggestions = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { limit = 10 } = req.query;

        const result = await FriendService.getFriendSuggestions(userId, parseInt(limit, 10));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Gợi ý kết bạn nâng cao (mutual friends)
 * GET /api/friends/suggestions/advanced
 * Query: limit
 */
export const getAdvancedFriendSuggestions = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { limit = 10 } = req.query;

        const result = await FriendService.getAdvancedFriendSuggestions(userId, parseInt(limit, 10));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
