import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: { type: String, required: true },
        media: {
            url: String,
            type: String,
            publicId: String
        },
    },
    { timestamps: true }
);

messageSchema.index({ conversationId: 1, createAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
