import { createError } from "../lib/utils.js";
import { friendService } from "../services/FriendService.js";

// Kiểm tra trạng thái quan hệ bạn bè
export const checkStatus = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const { userId } = req.params;

        if (!userId) throw createError("User ID is required", 400);
        if (currentUserId.toString() === userId.toString()) {
            throw createError("Cannot check friendship status with yourself", 400);
        }

        const result = await friendService.checkFriendshipStatus(currentUserId, userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Gửi lời mời kết bạn
export const sendRequest = async (req, res, next) => {
    try {
        const requesterId = req.user._id;
        const { userId: recipientId } = req.params;

        if (!recipientId) throw createError("Recipient ID is required", 400);
        if (requesterId.toString() === recipientId.toString()) {
            throw createError("Cannot send friend request to yourself", 400);
        }

        const result = await friendService.sendFriendRequest(requesterId, recipientId);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// Chấp nhận lời mời kết bạn (dùng friendshipId)
export const acceptRequest = async (req, res, next) => {
    try {
        const recipientId = req.user._id;
        const { friendshipId } = req.params;

        if (!friendshipId) throw createError("Friendship ID is required", 400);

        const result = await friendService.acceptFriendRequest(friendshipId, recipientId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Từ chối lời mời kết bạn (dùng friendshipId)
export const rejectRequest = async (req, res, next) => {
    try {
        const recipientId = req.user._id;
        const { friendshipId } = req.params;

        if (!friendshipId) throw createError("Friendship ID is required", 400);

        const result = await friendService.rejectFriendRequest(friendshipId, recipientId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Xóa bạn bè (dùng friendshipId)
export const removeFriend = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const { friendshipId } = req.params;

        if (!friendshipId) throw createError("Friendship ID is required", 400);

        const result = await friendService.removeFriendById(friendshipId, currentUserId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách bạn bè
export const getAllFriends = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const query = req.query;

        const result = await friendService.getAllFriends(userId, query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách lời mời kết bạn đang chờ
export const getFriendRequests = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const query = req.query;

        const result = await friendService.getFriendRequests(userId, query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Gợi ý kết bạn
export const getFriendSuggestions = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { limit = 10 } = req.query;

        const result = await friendService.getFriendSuggestions(userId, parseInt(limit, 10));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
