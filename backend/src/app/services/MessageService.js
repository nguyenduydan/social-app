import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../../utils/messageHelper.js";

export const MessageService = {
    async sendDirectMessage(senderId, recipientId, content, conversationId) {
        let conversation;

        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }

        // nếu chưa có cuộc trò chuyện thì tạo mới
        if (!conversation) {
            conversation = await Conversation.create({
                type: "direct",
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() }
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map()
            });
        }

        const message = await Message.create({
            conversation: conversation._id,
            sender: senderId,
            content,
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);

        await conversation.save();

        return message;
    },

    async sendGroupMessage(content, conversationId, senderId, conversation) {
        const message = await Message.create({
            conversation: conversationId,
            sender: senderId,
            content
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);

        await conversation.save();

        return message;
    }
};
