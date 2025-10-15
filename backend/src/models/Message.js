import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        conversation: { type: ObjectId, ref: 'Conversation', required: true },
        sender: { type: ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        media: {
            url: String,
            type: String,
            publicId: String
        },
        readBy: [{ type: ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);
