import { getPaginationMetadata, getPaginationParams } from "../lib/pagination.js";
import { createError } from "../lib/utils.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";

export class FriendService {
    /**
     * @desc Send friend request
     */
    async sendFriendRequest(requesterId, recipientId) {
        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            throw createError("User not found", 404);
        }

        // Check if friendship already exists in any form
        const existingFriendship = await Friend.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingFriendship) {
            this.handleExistingFriendship(existingFriendship);
        }

        //create new request
        const friendRequest = await Friend.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        await friendRequest.populate('recipient', 'displayName username email avatar');

        return friendRequest;
    }


    /**
     * @desc Accept friend request
     */
    async acceptFriendRequest(requesterId, recipientId) {
        const friendRequest = await this.findPendingRequest(requesterId, recipientId);

        friendRequest.status = 'accepted';
        await friendRequest.save();

        await friendRequest.populate('requester', 'displayName username email avatar');

        return friendRequest;
    }

    /**
    * @desc reject friend request
    */
    async rejectFriendRequest(requesterId, recipientId) {
        const friendRequest = await this.findPendingRequest(requesterId, recipientId);

        friendRequest.status = 'rejected';
        await friendRequest.save();

        return friendRequest;
    }

    // Remove friend
    async removeFriend(userId, friendId) {
        const friendship = await Friend.findOneAndDelete({
            $or: [
                { requester: userId, recipient: friendId, status: 'accepted' },
                { requester: friendId, recipient: userId, status: 'accepted' }
            ]
        });

        if (!friendship) {
            throw createError('Friendship not found', 404);
        }

        return { message: "Friend removed successfully" };
    }

    // Get all friends
    async getAllFriends(userId, query = {}) {
        const { page, limit, skip } = getPaginationParams(query);

        const [friends, total] = await Promise.all([
            Friend.find({
                $or: [
                    { requester: userId, status: 'accepted' },
                    { recipient: userId, status: 'accepted' }
                ]
            })
                .populate('requester', 'displayName username email avatar')
                .populate('recipient', 'displayName username email avatar')
                .skip(skip)
                .limit(limit)
                .sort({ updatedAt: -1 }),

            Friend.countDocuments({
                $or: [
                    { requester: userId, status: 'accepted' },
                    { recipient: userId, status: 'accepted' }
                ]
            })
        ]);

        const friendList = this.mapFriendsToList(friends, userId);
        const pagination = getPaginationMetadata(total, page, limit);

        return { friends: friendList, pagination };
    }

    // Get friend requests (received)
    async getFriendRequests(userId, query = {}) {
        const { page, limit, skip } = getPaginationParams(query);

        const [requests, total] = await Promise.all([
            Friend.find({
                recipient: userId,
                status: 'pending'
            })
                .populate('requester', 'displayName username email avatar')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            Friend.countDocuments({
                recipient: userId,
                status: 'pending'
            })
        ]);

        const requestList = this.mapRequestsToList(requests);
        const pagination = getPaginationMetadata(total, page, limit);

        return { friendRequests: requestList, pagination };
    }

    // Get friend suggestions (users who are not friends)
    async getFriendSuggestions(userId, limit = 10) {
        const existingConnections = await Friend.find({
            $or: [
                { requester: userId },
                { recipient: userId }
            ]
        }).select('requester recipient');

        const excludeIds = new Set([userId.toString()]);
        existingConnections.forEach(conn => {
            excludeIds.add(conn.requester.toString());
            excludeIds.add(conn.recipient.toString());
        });

        const suggestions = await User.find({
            _id: { $nin: Array.from(excludeIds) }
        })
            .select('username displayName email avatar')
            .limit(limit);

        return suggestions;
    }



    // --------------------------
    // HELPER METHODS
    // --------------------------
    // Helper: Find pending request or throw error
    async findPendingRequest(requesterId, recipientId) {
        const friendRequest = await Friend.findOne({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        if (!friendRequest) {
            throw createError('Friend request not found', 404);
        }

        return friendRequest;
    }

    handleExistingFriendship(friendship) {
        if (friendship.status === 'accepted') {
            throw createError('Already friends', 400);
        }
        if (friendship.status === 'pending') {
            throw createError('Friend request already sent', 400);
        }
        if (friendship.status === 'blocked') {
            throw createError('Cannot send friend request', 403);
        }
    }

    // Helper: Map friends to list format
    mapFriendsToList(friends, userId) {
        return friends.map(friendship => {
            const friend = friendship.requester._id.toString() === userId.toString()
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

    // Helper: Map requests to list format
    mapRequestsToList(requests) {
        return requests.map(req => ({
            _id: req._id,
            requester: req.requester,
            createdAt: req.createdAt
        }));
    }
}

export const friendService = new FriendService();
