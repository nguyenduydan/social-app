import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
    {
        type: { type: String, enum: ['direct', 'group'], default: 'direct' },
        name: String, // for group chats
        participants: [{ type: ObjectId, ref: 'User' }],
        lastMessage: {
            content: String,
            sender: { type: ObjectId, ref: 'User' },
            createdAt: Date
        },
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
