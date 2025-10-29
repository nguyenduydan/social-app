import { getPaginationMetadata, getPaginationParams } from "../lib/pagination.js";
import { createError } from "../lib/utils.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";

export class FriendService {
    async checkFriendshipStatus(currentUserId, targetUserId) {
        const friendship = await Friend.findOne({
            $or: [
                { requester: currentUserId, recipient: targetUserId },
                { requester: targetUserId, recipient: currentUserId }
            ]
        });

        if (!friendship) {
            return {
                status: "none",
                isFriend: false,
                isRequester: false,
                pending: false,
            };
        }

        const isRequester = friendship.requester.toString() === currentUserId.toString();
        const status = friendship.status;

        return {
            status,
            isRequester,
            isFriend: status === "accepted",
            pending: status === "pending",
            friendshipId: friendship._id,
        };
    }

    // Gửi lời mời kết bạn
    async sendFriendRequest(requesterId, recipientId) {
        const recipient = await User.findById(recipientId);
        if (!recipient) throw createError("User not found", 404);

        const existingFriendship = await Friend.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingFriendship) {
            this.handleExistingFriendship(existingFriendship);
        }

        const friendRequest = await Friend.create({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        });

        await friendRequest.populate("recipient", "displayName username email avatar");
        return friendRequest;
    }

    // Chấp nhận lời mời kết bạn (dùng friendshipId)
    async acceptFriendRequest(friendshipId, userId) {
        const friendRequest = await Friend.findById(friendshipId);

        if (!friendRequest || friendRequest.status !== "pending") {
            throw createError("Friend request not found or invalid", 404);
        }

        if (friendRequest.recipient.toString() !== userId.toString()) {
            throw createError("You are not authorized to accept this request", 403);
        }

        friendRequest.status = "accepted";
        await friendRequest.save();
        await friendRequest.populate("requester", "displayName username email avatar");

        return friendRequest;
    }

    // Từ chối lời mời kết bạn (xóa khỏi DB)
    async rejectFriendRequest(friendshipId, userId) {
        const friendRequest = await Friend.findById(friendshipId);

        if (!friendRequest || friendRequest.status !== "pending") {
            throw createError("Friend request not found or invalid", 404);
        }

        if (friendRequest.recipient.toString() !== userId.toString()) {
            throw createError("You are not authorized to reject this request", 403);
        }

        // Xóa hoàn toàn bản ghi lời mời kết bạn
        await Friend.findByIdAndDelete(friendshipId);

        return { message: "Friend request has been rejected and deleted." };
    }


    // Hủy kết bạn (dựa trên friendshipId)
    async removeFriendById(friendshipId, userId) {
        const friendship = await Friend.findById(friendshipId);
        if (!friendship) throw createError("Friendship not found", 404);

        const isParticipant =
            friendship.requester.toString() === userId.toString() ||
            friendship.recipient.toString() === userId.toString();

        if (!isParticipant) {
            throw createError("You are not authorized to remove this friendship", 403);
        }

        await friendship.deleteOne();
        return { message: "Friend removed successfully" };
    }

    // Lấy danh sách bạn bè
    async getAllFriends(userId, query = {}) {
        const { page, limit, skip } = getPaginationParams(query);

        const [friends, total] = await Promise.all([
            Friend.find({
                $or: [
                    { requester: userId, status: "accepted" },
                    { recipient: userId, status: "accepted" }
                ]
            })
                .populate("requester", "displayName username email avatar")
                .populate("recipient", "displayName username email avatar")
                .skip(skip)
                .limit(limit)
                .sort({ updatedAt: -1 }),

            Friend.countDocuments({
                $or: [
                    { requester: userId, status: "accepted" },
                    { recipient: userId, status: "accepted" }
                ]
            })
        ]);

        const friendList = this.mapFriendsToList(friends, userId);
        const pagination = getPaginationMetadata(total, page, limit);

        return { friends: friendList, pagination };
    }

    // Lấy danh sách lời mời kết bạn đang chờ
    async getFriendRequests(userId, query = {}) {
        const { page, limit, skip } = getPaginationParams(query);

        const [requests, total] = await Promise.all([
            Friend.find({ recipient: userId, status: "pending" })
                .populate("requester", "displayName username email avatar")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            Friend.countDocuments({ recipient: userId, status: "pending" })
        ]);

        const requestList = this.mapRequestsToList(requests);
        const pagination = getPaginationMetadata(total, page, limit);

        return { friendRequests: requestList, pagination };
    }

    // Gợi ý kết bạn (người chưa có quan hệ bạn bè)
    async getFriendSuggestions(userId, limit = 10) {
        const existingConnections = await Friend.find({
            $or: [
                { requester: userId },
                { recipient: userId }
            ]
        }).select("requester recipient");

        const excludeIds = new Set([userId.toString()]);
        existingConnections.forEach(conn => {
            excludeIds.add(conn.requester.toString());
            excludeIds.add(conn.recipient.toString());
        });

        const suggestions = await User.find({
            _id: { $nin: Array.from(excludeIds) }
        })
            .select("username displayName email avatar")
            .limit(limit);

        return { suggestions };
    }

    // Helper: kiểm tra tình trạng mối quan hệ
    handleExistingFriendship(friendship) {
        if (friendship.status === "accepted") throw createError("Already friends", 400);
        if (friendship.status === "pending") throw createError("Friend request already sent", 400);
        if (friendship.status === "blocked") throw createError("Cannot send friend request", 403);
    }

    // Helper: ánh xạ danh sách bạn bè
    mapFriendsToList(friends, userId) {
        return friends.map(friendship => {
            const friend =
                friendship.requester._id.toString() === userId.toString()
                    ? friendship.recipient
                    : friendship.requester;

            return {
                _id: friend._id,
                displayName: friend.displayName || "Người dùng",
                username: friend.username,
                avatar: friend.avatar?.url || null,
                email: friend.email,
                friendshipId: friendship._id,
                friendsSince: friendship.updatedAt,
            };
        });
    }

    // Helper: ánh xạ danh sách lời mời
    mapRequestsToList(requests) {
        return requests.map(req => ({
            friendshipId: req._id,
            requester: req.requester,
            createdAt: req.createdAt
        }));
    }
}

export const friendService = new FriendService();
