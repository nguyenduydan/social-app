import { MessageService } from "../services/MessageService.js";
import { createError } from "../utils/AppError.js";


export const sendDirectMessage = async (req, res, next) => {
    try {
        const { recipientId, content, conversationId } = req.body;
        const senderId = req.user._id;

        if (!content) {
            throw createError("Content is required", 400);
        }

        const result = await MessageService.sendDirectMessage(senderId, recipientId, content, conversationId);

        return res.status(201).json({ message: result });
    } catch (error) {
        next(error);
    }
};

export const sendGroupMessage = async (req, res, next) => {
    try {
        const { content, conversationId } = req.body;
        const senderId = req.user._id;
        const conversation = req.conversation;

        if (!content) {
            throw createError("Content is required", 400);
        }

        const message = await MessageService.sendGroupMessage(content, conversationId, senderId, conversation);

        return res.status(201).json({ message });
    } catch (error) {
        next(error);
    }
};
