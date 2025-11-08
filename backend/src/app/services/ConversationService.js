import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { createError } from "../../utils/AppError.js";

export const ConversationService = {
    async createConversation(userId, type, name, memberIds) {
        let conversation;

        if (type === 'direct') {
            const participantId = memberIds[0];

            conversation = await Conversation.findOne({
                type: 'direct',
                "participants.userId": { $all: [userId, participantId] }
            });

            if (!conversation) {
                conversation = new Conversation({
                    type: 'direct',
                    participants: [{ userId }, { userId: participantId }],
                    lastMessageAt: new Date()
                });
                await conversation.save();
            }
        }

        if (type === 'group') {
            conversation = new Conversation({
                type: 'group',
                participants: [
                    { userId },
                    ...memberIds.map((id) => ({ userId: id }))
                ],
                group: {
                    name,
                    createdBy: userId
                },
                lastMessageAt: new Date()
            });
            await conversation.save();
        }
        if (!conversation) {
            throw createError("Conversation type not correct", 400);
        }

        const result = await conversation.populate([
            { path: 'participants.userId', select: 'displayName avatar' },
            { path: 'seenBy', select: 'displayName avatar' },
            { path: 'lastMessage.senderId', select: 'displayName avatar' }
        ]);

        return result;
    },

    async getConversations(userId) {
        const conversations = await Conversation.find({
            'participants.userId': userId
        })
            .sort({ lastMessageAt: -1, updatedAt: -1 })
            .populate({
                path: 'participants.userId', select: 'displayName avatar'
            })
            .populate({
                path: 'seenBy', select: 'displayName avatar'
            });

        const formatted = conversations.map((convo) => {
            const participants = (convo.participants || []).map((p) => ({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatar: p.userId?.avatar ?? null,
                joinedAt: p.joinedAt
            }));

            return {
                ...convo.toObject(),
                unreadCounts: convo.unreadCounts || {},
                participants
            };
        });
        return formatted;
    },

    async getMessages(conversationId, limit = 50, cursor) {
        const query = { conversation: conversationId };

        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        let messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) + 1)
            .populate('sender', 'name avatar')
            .lean();

        let nextCursor = null;
        if (messages.length > Number(limit)) {
            const nextMessage = messages[messages.length - 1];
            nextCursor = nextMessage.createdAt.toISOString();
            messages.pop();
        }

        messages.reverse(); // newest at bottom

        return { messages, nextCursor };
    }
};
