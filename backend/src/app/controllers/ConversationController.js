import { ConversationService } from "../services/ConversationService.js";
import { createError } from "../../utils/AppError.js";

export const createConversation = async (req, res, next) => {
    try {
        const { type, name, memberIds } = req.body;
        const userId = req.user._id;

        if (!type || (type === "group" && !name) || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            throw createError("Name group and list member is required", 400);
        }

        const conversation = await ConversationService.createConversation(userId, type, name, memberIds);

        return res.status(201).json({ conversation });

    } catch (error) {
        next(error);
    }
};

export const getConversations = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const conversations = await ConversationService.getConversations(userId);

        return res.status(200).json(conversations);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { limit = 50, cursor } = req.query;

        const query = { conversationId };

        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        const { messages, nextCursor } = await ConversationService.getMessages(conversationId, limit, cursor, query);
        return res.status(200).json({ messages, nextCursor });
    } catch (error) {
        next(error);
    }
};
