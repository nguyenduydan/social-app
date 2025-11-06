import { getPaginationMetadata, getPaginationParams } from "../../utils/pagination.js";
import { createError } from "../../utils/AppError.js";
import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const FriendService = {
    async checkFriendshipStatus(currentUserId, targetUserId) {
        // Kiểm tra nếu đã là bạn bè
        const friendship = await Friend.findOne({
            $or: [
                { requester: currentUserId, recipient: targetUserId },
                { requester: targetUserId, recipient: currentUserId },
            ],
        });

        if (friendship) {
            return {
                status: "friend",
                isFriend: true,
                isRequester: friendship.requester.toString() === currentUserId.toString(),
                pending: false,
            };
        }

        // Kiểm tra nếu có lời mời đang chờ
        const request = await FriendRequest.findOne({
            $or: [
                { from: currentUserId, to: targetUserId },
                { from: targetUserId, to: currentUserId },
            ],
            status: "pending",
        });

        if (request) {
            return {
                status: "pending",
                isFriend: false,
                isRequester: request.from.toString() === currentUserId.toString(),
                pending: true,
            };
        }

        return {
            status: "none",
            isFriend: false,
            isRequester: false,
            pending: false,
        };
    },
    /**
     * Gửi lời mời kết bạn
     */
    async sendFriendRequest(from, to, message = '') {
        // Validate user tồn tại
        const userExists = await User.exists({ _id: to });
        if (!userExists) {
            throw createError("User not found", 404);
        }

        // Kiểm tra trạng thái hiện tại
        const currentStatus = await this.checkFriendshipStatus(from, to);

        if (currentStatus.isFriend) {
            throw createError("Hai người đã là bạn bè", 400);
        }

        if (currentStatus.status === "pending") {
            throw createError("Đã có lời mời kết bạn đang chờ", 400);
        }

        if (currentStatus.status === "blocked") {
            throw createError("Cannot send friend request", 403);
        }

        if (currentStatus.status === "pending") {
            throw createError(
                "This user has already sent you a friend request. Please accept or reject their request first.",
                400
            );
        }

        // Tạo lời mời mới
        const request = await FriendRequest.create({
            from,
            to,
            message: message || '',
            status: 'pending'
        });

        await request.populate('from', 'displayName username email avatar');
        await request.populate('to', 'displayName username email avatar');

        return {
            message: "Friend request sent successfully",
            request
        };
    },

    /**
     * Chấp nhận lời mời kết bạn
     * @param {String} requestId - ID của FriendRequest (không phải friendshipId)
     * @param {String} userId - ID người nhận lời mời
     */
    async acceptFriendRequest(requestId, userId) {
        // Tìm friend request
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            throw createError("Friend request not found", 404);
        }

        // Validate quyền (chỉ người nhận mới accept được)
        if (friendRequest.to.toString() !== userId.toString()) {
            throw createError("You are not authorized to accept this request", 403);
        }

        // Validate status
        if (friendRequest.status !== 'pending') {
            throw createError(`Friend request is already ${friendRequest.status}`, 400);
        }

        // Update friend request status
        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Tạo friendship record (Friend model sẽ tự sort requester/recipient)
        const friendship = await Friend.create({
            requester: friendRequest.from,
            recipient: friendRequest.to
        });

        await friendship.populate([
            { path: 'requester', select: '_id displayName username avatar' },
            { path: 'recipient', select: '_id displayName username avatar' }
        ]);

        return {
            message: "Friend request accepted successfully",
            friendship,
            acceptedAt: friendship.createdAt
        };
    },

    /**
     * Từ chối lời mời kết bạn
     * @param {String} requestId - ID của FriendRequest
     * @param {String} userId - ID người nhận lời mời
     */
    async rejectFriendRequest(requestId, userId) {
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            throw createError("Friend request not found", 404);
        }

        // Validate quyền
        if (friendRequest.to.toString() !== userId.toString()) {
            throw createError("You are not authorized to reject this request", 403);
        }

        // Validate status
        if (friendRequest.status !== 'pending') {
            throw createError(`Friend request is already ${friendRequest.status}`, 400);
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return {
            message: "Friend request has been rejected",
            requestId
        };
    },

    /**
     * Hủy lời mời đã gửi
     * @param {String} requestId - ID của FriendRequest
     * @param {String} userId - ID người gửi lời mời
     */
    async cancelFriendRequest(requestId, userId) {
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            throw createError("Friend request not found", 404);
        }

        // Validate quyền (chỉ người gửi mới cancel được)
        if (friendRequest.from.toString() !== userId.toString()) {
            throw createError("You are not authorized to cancel this request", 403);
        }

        if (friendRequest.status !== 'pending') {
            throw createError(`Cannot cancel a ${friendRequest.status} request`, 400);
        }

        // Xóa lời mời
        await FriendRequest.findByIdAndDelete(requestId);

        return {
            message: "Friend request has been cancelled",
            requestId
        };
    },

    /**
     * Hủy kết bạn
     * @param {String} friendshipId - ID của Friend record
     * @param {String} userId - ID người thực hiện
     */
    async removeFriendById(friendshipId, userId) {
        const friendship = await Friend.findById(friendshipId);

        if (!friendship) {
            throw createError("Friendship not found", 404);
        }

        // Validate quyền (cả 2 bên đều có thể unfriend)
        const isParticipant =
            friendship.requester.toString() === userId.toString() ||
            friendship.recipient.toString() === userId.toString();

        if (!isParticipant) {
            throw createError("You are not authorized to remove this friendship", 403);
        }

        // Lưu IDs trước khi xóa
        const userAId = friendship.requester;
        const userBId = friendship.recipient;

        // Xóa friendship
        await friendship.deleteOne();

        //Update lại các FriendRequest liên quan
        await FriendRequest.updateMany(
            {
                $or: [
                    { from: userAId, to: userBId },
                    { from: userBId, to: userAId }
                ],
                status: 'accepted'
            },
            { status: 'rejected' }
        );

        return {
            message: "Friend removed successfully",
            friendshipId
        };
    },

    /**
     * Lấy danh sách bạn bè
     */
    async getAllFriends(userId, query = {}) {
        const { page, limit, skip } = getPaginationParams(query);
        const { search = '' } = query;

        // Tìm tất cả friendships
        const matchCondition = {
            $or: [
                { requester: userId },
                { recipient: userId }
            ]
        };

        const [friends, total] = await Promise.all([
            Friend.find(matchCondition)
                .populate('requester', 'displayName username email avatar')
                .populate('recipient', 'displayName username email avatar')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),

            Friend.countDocuments(matchCondition)
        ]);

        // Map ra danh sách bạn bè
        let friendList = this.mapFriendsToList(friends, userId);

        // Apply search filter nếu có
        if (search) {
            const searchLower = search.toLowerCase();
            friendList = friendList.filter(item =>
                item.displayName?.toLowerCase().includes(searchLower) ||
                item.username?.toLowerCase().includes(searchLower) ||
                item.email?.toLowerCase().includes(searchLower)
            );
        }

        const pagination = getPaginationMetadata(total, page, limit);

        return {
            friends: friendList,
            pagination
        };
    },

    /**
     * Lấy danh sách lời mời kết bạn
     * @param {String} userId - ID người dùng
     * @param {Object} query - Query params: page, limit, type (received/sent)
     */
    async getFriendRequests(userId, query = {}) {
        const { page, limit, skip } = getPaginationParams(query);
        const { type = 'received' } = query; // 'received' hoặc 'sent'

        const filter = {
            status: 'pending',
            [type === 'received' ? 'to' : 'from']: userId
        };

        const [requests, total] = await Promise.all([
            FriendRequest.find(filter)
                .populate('from', 'displayName username email avatar')
                .populate('to', 'displayName username email avatar')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            FriendRequest.countDocuments(filter)
        ]);

        const requestList = this.mapRequestsToList(requests, type);
        const pagination = getPaginationMetadata(total, page, limit);

        return {
            friendRequests: requestList,
            pagination,
            type
        };
    },

    /**
     * Gợi ý bạn bè (người chưa có quan hệ)
     */
    async getFriendSuggestions(userId, limit = 10) {
        // Lấy tất cả connections hiện có
        const [friendships, pendingRequests] = await Promise.all([
            Friend.find({
                $or: [
                    { requester: userId },
                    { recipient: userId }
                ]
            }).select('requester recipient'),

            FriendRequest.find({
                $or: [
                    { from: userId, status: 'pending' },
                    { to: userId, status: 'pending' }
                ]
            }).select('from to')
        ]);

        // Build exclude list
        const excludeIds = new Set([userId.toString()]);

        friendships.forEach(conn => {
            excludeIds.add(conn.requester.toString());
            excludeIds.add(conn.recipient.toString());
        });

        pendingRequests.forEach(req => {
            excludeIds.add(req.from.toString());
            excludeIds.add(req.to.toString());
        });

        // Tìm users chưa có quan hệ
        const suggestions = await User.find({
            _id: { $nin: Array.from(excludeIds) }
        })
            .select('username displayName email avatar')
            .limit(parseInt(limit, 10));

        return {
            suggestions,
            total: suggestions.length
        };
    },

    /**
     * Gợi ý bạn bè nâng cao (mutual friends)
     */
    async getAdvancedFriendSuggestions(userId, limit = 10) {
        // Lấy danh sách bạn bè hiện tại
        const currentFriends = await Friend.find({
            $or: [
                { requester: userId },
                { recipient: userId }
            ]
        });

        const friendIds = currentFriends.map(f =>
            f.requester.toString() === userId.toString()
                ? f.recipient
                : f.requester
        );

        if (friendIds.length === 0) {
            // Nếu chưa có bạn nào, return random users
            return this.getFriendSuggestions(userId, limit);
        }

        // Lấy pending requests để exclude
        const pendingRequests = await FriendRequest.find({
            $or: [
                { from: userId, status: 'pending' },
                { to: userId, status: 'pending' }
            ]
        });

        const pendingUserIds = pendingRequests.map(r =>
            r.from.toString() === userId.toString() ? r.to.toString() : r.from.toString()
        );

        // Tìm bạn của bạn
        const friendsOfFriends = await Friend.find({
            $or: [
                { requester: { $in: friendIds } },
                { recipient: { $in: friendIds } }
            ]
        });

        // Đếm mutual friends
        const mutualCount = {};
        friendsOfFriends.forEach(f => {
            const potentialFriendId =
                friendIds.includes(f.requester.toString())
                    ? f.recipient.toString()
                    : f.requester.toString();

            // Exclude: bản thân, bạn hiện tại, pending requests
            if (
                potentialFriendId !== userId.toString() &&
                !friendIds.includes(potentialFriendId) &&
                !pendingUserIds.includes(potentialFriendId)
            ) {
                mutualCount[potentialFriendId] = (mutualCount[potentialFriendId] || 0) + 1;
            }
        });

        // Sort và lấy top suggestions
        const topSuggestionIds = Object.entries(mutualCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);

        if (topSuggestionIds.length === 0) {
            return this.getFriendSuggestions(userId, limit);
        }

        // Lấy thông tin users
        const suggestions = await User.find({
            _id: { $in: topSuggestionIds }
        }).select('username displayName email avatar');

        // Thêm mutual friends count
        const suggestionsWithMutual = suggestions.map(user => ({
            ...user.toObject(),
            mutualFriendsCount: mutualCount[user._id.toString()] || 0
        }));

        return {
            suggestions: suggestionsWithMutual,
            total: suggestionsWithMutual.length
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

