import { createError } from "../lib/utils.js";
import { friendService } from "../services/FriendService.js";

export const sendRequest = async (req, res, next) => {
    try {
        const requesterId = req.user._id; //From middleware auth
        const { userId: recipientId } = req.params; //From url endpoint

        if (!recipientId) {
            return createError("Recipient ID is required", 400);
        }

        if (requesterId === recipientId) {
            return createError("Cannot send friend request to yourself", 400);
        }

        // call service
        const result = await friendService.sendFriendRequest(requesterId, recipientId);
        return res.status(201).json(result);

    } catch (error) {
        next(error);
    }
};

// Accept friend request
export const acceptRequest = async (req, res, next) => {
    try {
        const recipientId = req.user.id;
        const { userId: requesterId } = req.params;

        if (!requesterId) {
            return createError("Requester ID is required", 400);
        }

        const result = await friendService.acceptFriendRequest(requesterId, recipientId);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Reject friend request
export const rejectRequest = async (req, res, next) => {
    try {
        const recipientId = req.user.id;
        const { userId: requesterId } = req.params;

        if (!requesterId) {
            return createError("Requester ID is required", 400);
        }

        const result = await friendService.rejectFriendRequest(requesterId, recipientId);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const removeFriend = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const { userId: friendId } = req.params;

        if (!friendId) {
            return createError("Friend ID is required", 400);
        }

        const result = await friendService.removeFriend(currentUserId, friendId);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAllFriends = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const query = req.query;

        const result = await friendService.getAllFriends(userId, query);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getFriendRequests = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const query = req.query;

        const result = await friendService.getFriendRequests(userId, query);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getFriendSuggestions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { limit = 10 } = req.query;

        const result = await friendService.getFriendSuggestions(userId, parseInt(limit));
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
