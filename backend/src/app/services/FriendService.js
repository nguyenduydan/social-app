import { getPaginationMetadata, getPaginationParams } from "../../utils/pagination.js";
import { createError } from "../../utils/AppError.js";
import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const FriendService = {
    async checkFriendshipStatus(currentUserId, targetUserId) {
        if (currentUserId.toString() === targetUserId.toString()) {
            return { status: "self", isFriend: false, isRequester: false, pending: false };
        }

        // Dùng Promise.all để song song 2 truy vấn (giảm 50% thời gian)
        const [friendship, request] = await Promise.all([
            Friend.findOne({
                $or: [
                    { requester: currentUserId, recipient: targetUserId },
                    { requester: targetUserId, recipient: currentUserId },
                ],
            }).lean(),
            FriendRequest.findOne({
                $or: [
                    { from: currentUserId, to: targetUserId },
                    { from: targetUserId, to: currentUserId },
                ],
                status: "pending",
            }).lean(),
        ]);

        if (friendship) {
            return {
                status: "friend",
                isFriend: true,
                isRequester: friendship.requester.toString() === currentUserId.toString(),
                pending: false,
            };
        }

        if (request) {
            return {
                status: "pending",
                isFriend: false,
                isRequester: request.from.toString() === currentUserId.toString(),
                pending: true,
            };
        }

        return { status: "none", isFriend: false, isRequester: false, pending: false };
    },
    /**
     * Gửi lời mời kết bạn
     */
    async sendFriendRequest(from, to, message = "") {
        if (from.toString() === to.toString()) {
            throw createError("Không thể gửi lời mời kết bạn cho chính mình", 400);
        }

        // Dùng lean() để không tạo instance Mongoose (nhanh hơn ~30%)
        const [userExists, currentStatus] = await Promise.all([
            User.exists({ _id: to }),
            this.checkFriendshipStatus(from, to),
        ]);

        if (!userExists) throw createError("Người dùng không tồn tại", 404);
        if (currentStatus.isFriend) throw createError("Hai người đã là bạn bè", 400);

        if (currentStatus.status === "pending") {
            if (currentStatus.isRequester)
                throw createError("Bạn đã gửi lời mời kết bạn trước đó", 400);
            else
                throw createError("Người này đã gửi bạn lời mời. Hãy chấp nhận hoặc từ chối trước.", 400);
        }

        // Chỉ populate những field cần thiết
        const request = await FriendRequest.create({ from, to, message, status: "pending" });
        await request.populate([
            { path: "from", select: "displayName username avatar" },
            { path: "to", select: "displayName username avatar" },
        ]);

        return { message: "Gửi lời mời kết bạn thành công", request };
    },

    /**
     * Chấp nhận lời mời kết bạn
     * @param {String} requestId - ID của FriendRequest (không phải friendshipId)
     * @param {String} userId - ID người nhận lời mời
     */
    async acceptFriendRequest(requestId, userId) {
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) throw createError("Friend request not found", 404);

        const userIdStr = userId.toString();
        if (friendRequest.to.toString() !== userIdStr)
            throw createError("You are not authorized to accept this request", 403);

        if (friendRequest.status !== "pending")
            throw createError(`Friend request is already ${friendRequest.status}`, 400);

        friendRequest.status = "accepted";
        await friendRequest.save();

        const friendship = await Friend.create({
            requester: friendRequest.from,
            recipient: friendRequest.to,
        });

        await friendship.populate([
            { path: "requester", select: "_id displayName username avatar" },
            { path: "recipient", select: "_id displayName username avatar" },
        ]);

        return {
            message: "Friend request accepted successfully",
            friendship,
            acceptedAt: friendship.createdAt,
        };
    },

    /**
     * Từ chối lời mời kết bạn
     * @param {String} requestId - ID của FriendRequest
     * @param {String} userId - ID người nhận lời mời
     */
    async rejectFriendRequest(requestId, userId) {
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) throw createError("Friend request not found", 404);

        if (friendRequest.to.toString() !== userId.toString())
            throw createError("You are not authorized to reject this request", 403);

        if (friendRequest.status !== "pending")
            throw createError(`Friend request is already ${friendRequest.status}`, 400);

        await friendRequest.deleteOne();

        return { message: "Friend request has been rejected", requestId };
    },

    /**
     * Hủy lời mời đã gửi
     * @param {String} requestId - ID của FriendRequest
     * @param {String} userId - ID người gửi lời mời
     */
    async cancelFriendRequest(requestId, userId) {
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) throw createError("Friend request not found", 404);

        if (friendRequest.from.toString() !== userId.toString())
            throw createError("You are not authorized to cancel this request", 403);

        if (friendRequest.status !== "pending")
            throw createError(`Cannot cancel a ${friendRequest.status} request`, 400);

        await friendRequest.deleteOne();
        return { message: "Friend request cancelled", requestId };
    },

    /**
     * Hủy kết bạn
     * @param {String} friendshipId - ID của Friend record
     * @param {String} userId - ID người thực hiện
     */
    async removeFriendById(friendshipId, userId) {
        const friendship = await Friend.findById(friendshipId);
        if (!friendship) throw createError("Friendship not found", 404);

        const userIdStr = userId.toString();
        const isParticipant =
            friendship.requester.toString() === userIdStr ||
            friendship.recipient.toString() === userIdStr;
        if (!isParticipant)
            throw createError("You are not authorized to remove this friendship", 403);

        const [userAId, userBId] = [friendship.requester, friendship.recipient];
        await Promise.all([
            friendship.deleteOne(),
            FriendRequest.updateMany(
                {
                    $or: [
                        { from: userAId, to: userBId },
                        { from: userBId, to: userAId },
                    ],
                    status: "accepted",
                },
                { status: "rejected" }
            ),
        ]);

        return { message: "Friend removed successfully", friendshipId };
    },

    /**
     * Lấy danh sách bạn bè
     */
    async getAllFriends(userId, query = {}) {
        const { page, limit, skip } = getPaginationParams(query);
        const { search = "" } = query;

        const matchCondition = {
            $or: [{ requester: userId }, { recipient: userId }],
        };

        const [friends, total] = await Promise.all([
            Friend.find(matchCondition)
                .populate("requester", "displayName username email avatar")
                .populate("recipient", "displayName username email avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Friend.countDocuments(matchCondition),
        ]);

        let friendList = friends.map((f) => {
            const friend =
                f.requester._id.toString() === userId.toString()
                    ? f.recipient
                    : f.requester;
            return {
                ...friend,
                friendshipId: f._id,
                createdAt: f.createdAt,
            };
        });

        if (search) {
            const s = search.toLowerCase();
            friendList = friendList.filter(
                (f) =>
                    f.displayName?.toLowerCase().includes(s) ||
                    f.username?.toLowerCase().includes(s) ||
                    f.email?.toLowerCase().includes(s)
            );
        }

        return {
            friends: friendList,
            pagination: getPaginationMetadata(total, page, limit),
        };
    },

    /**
     * Lấy danh sách lời mời kết bạn
     * @param {String} userId - ID người dùng
     * @param {Object} query - Query params: page, limit, type (received/sent)
     */
    async getFriendRequests(userId, query = {}) {
        const { page, limit, skip } = getPaginationParams(query);
        const { type = "received" } = query;

        const filter = {
            status: "pending",
            [type === "received" ? "to" : "from"]: userId,
        };

        const [requests, total] = await Promise.all([
            FriendRequest.find(filter)
                .populate("from", "displayName username email avatar")
                .populate("to", "displayName username email avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            FriendRequest.countDocuments(filter),
        ]);

        const mapped = requests.map((r) => ({
            _id: r._id,
            from: r.from,
            to: r.to,
            createdAt: r.createdAt,
        }));

        return {
            friendRequests: mapped,
            pagination: getPaginationMetadata(total, page, limit),
            type,
        };
    },

    /**
     * Gợi ý bạn bè (người chưa có quan hệ)
     */
    async getFriendSuggestions(userId, limit = 10) {
        const [friendships, pendingRequests] = await Promise.all([
            Friend.find({
                $or: [{ requester: userId }, { recipient: userId }],
            }).select("requester recipient").lean(),
            FriendRequest.find({
                $or: [
                    { from: userId, status: "pending" },
                    { to: userId, status: "pending" },
                ],
            }).select("from to").lean(),
        ]);

        const exclude = new Set([userId.toString()]);
        friendships.forEach((f) => {
            exclude.add(f.requester.toString());
            exclude.add(f.recipient.toString());
        });
        pendingRequests.forEach((r) => {
            exclude.add(r.from.toString());
            exclude.add(r.to.toString());
        });

        const suggestions = await User.find({
            _id: { $nin: Array.from(exclude) },
        })
            .select("username displayName email avatar")
            .limit(Number(limit))
            .lean();

        return { suggestions, total: suggestions.length };
    },

    /**
     * Gợi ý bạn bè nâng cao (mutual friends)
     */
    async getAdvancedFriendSuggestions(userId, limit = 10) {
        const userIdStr = userId.toString();

        const currentFriends = await Friend.find({
            $or: [{ requester: userId }, { recipient: userId }],
        }).lean();

        const friendIds = currentFriends.map((f) =>
            f.requester.toString() === userIdStr
                ? f.recipient.toString()
                : f.requester.toString()
        );

        if (!friendIds.length)
            return this.getFriendSuggestions(userId, limit);

        const pendingRequests = await FriendRequest.find({
            $or: [
                { from: userId, status: "pending" },
                { to: userId, status: "pending" },
            ],
        }).lean();

        const pendingUserIds = pendingRequests.map((r) =>
            r.from.toString() === userIdStr ? r.to.toString() : r.from.toString()
        );

        const friendsOfFriends = await Friend.find({
            $or: [
                { requester: { $in: friendIds } },
                { recipient: { $in: friendIds } },
            ],
        }).lean();

        const mutualCount = {};
        for (const f of friendsOfFriends) {
            const potentialId = friendIds.includes(f.requester.toString())
                ? f.recipient.toString()
                : f.requester.toString();

            if (
                potentialId !== userIdStr &&
                !friendIds.includes(potentialId) &&
                !pendingUserIds.includes(potentialId)
            ) {
                mutualCount[potentialId] = (mutualCount[potentialId] || 0) + 1;
            }
        }

        const topIds = Object.entries(mutualCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);

        if (!topIds.length) return this.getFriendSuggestions(userId, limit);

        const suggestions = await User.find({ _id: { $in: topIds } })
            .select("username displayName email avatar")
            .lean();

        return {
            suggestions: suggestions.map((u) => ({
                ...u,
                mutualFriendsCount: mutualCount[u._id.toString()] || 0,
            })),
            total: suggestions.length,
        };
    },

    // ==================== HELPER METHODS ====================

    /**
     * Map danh sách friendships thành friend list
     */
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
                avatar: friend.avatar?.url || friend.avatar || null,
                email: friend.email,
                friendshipId: friendship._id,
                friendsSince: friendship.createdAt,
            };
        });
    },

    /**
     * Map danh sách friend requests
     */
    mapRequestsToList(requests, type = 'received') {
        return requests.map(req => ({
            requestId: req._id,
            requester: type === 'received' ? req.from : req.to,
            message: req.message || '',
            status: req.status,
            createdAt: req.createdAt
        }));
    }
}

