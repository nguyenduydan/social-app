// src/middleware/checkFriendship.js
import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import { createError } from "../../utils/AppError.js";

const normalizePair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id?.toString();
        const recipientId = req.body?.recipientId ?? null;
        const memberIds = req.body?.memberIds ?? [];

        if (!recipientId && memberIds.length === 0) {
            throw createError("Recipient ID (userId) is required or memberIds", 400);
        }

        if (me === recipientId) {
            throw createError("Cannot check friendship with yourself", 400);
        }

        const [userA, userB] = normalizePair(me, recipientId);

        // Kiểm tra đã là bạn bè chưa
        const friendship = await Friend.findOne({ requester: userA, recipient: userB });

        if (friendship) {
            req.friendshipStatus = {
                status: "accepted",
                isFriend: true,
                isRequester: friendship.requester.toString() === me,
                pending: false,
                friendshipId: friendship._id,
                since: friendship.createdAt,
            };
            return next();
        }

        // Kiểm tra lời mời đã gửi
        const sentRequest = await FriendRequest.findOne({
            from: me,
            to: recipientId,
            status: "pending",
        });

        if (sentRequest) {
            req.friendshipStatus = {
                status: "pending",
                isFriend: false,
                isRequester: true,
                pending: true,
                requestId: sentRequest._id,
                sentAt: sentRequest.createdAt,
            };
            return next();
        }

        // Kiểm tra lời mời đã nhận
        const receivedRequest = await FriendRequest.findOne({
            from: recipientId,
            to: me,
            status: "pending",
        });

        if (receivedRequest) {
            req.friendshipStatus = {
                status: "pending",
                isFriend: false,
                isRequester: false,
                pending: true,
                requestId: receivedRequest._id,
                receivedAt: receivedRequest.createdAt,
            };
            return next();
        }

        // Kiểm tra bị block
        const blockedRequest = await FriendRequest.findOne({
            $or: [
                { from: me, to: recipientId, status: "blocked" },
                { from: recipientId, to: me, status: "blocked" },
            ],
        });

        if (blockedRequest) {
            req.friendshipStatus = {
                status: "blocked",
                isFriend: false,
                isRequester: false,
                pending: false,
            };
            return next();
        }

        // Không có quan hệ nào
        req.friendshipStatus = {
            status: "none",
            isFriend: false,
            isRequester: false,
            pending: false,
        };

        const friendChecks = memberIds.map(async (memberId) => {
            const [userA, userB] = pair(me, memberId);
            const friend = await Friend.findOne({ userA, userB });
            return friend ? null : memberId;
        });

        const results = await Promise.all(friendChecks);
        const notFriends = results.filter(Boolean);

        if (notFriends.length > 0) {
            throw createError("You only add your friends into this group", 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const checkGroupMembership = async (req, res, next) => {
    try {
        const { conversationId } = req.body;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            throw createError("Not found conversation", 404);
        }

        const isMember = conversation.participants.some((p) => p.userId.toString() === userId.toString());

        if (!isMember) {
            throw createError("Bạn không ở trong nhóm này", 403);
        }

        req.conversation = conversation;

        next();

    } catch (error) {
        next(error);
    }
};
