import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        recipient: { type: ObjectId, ref: 'User', required: true },
        sender: { type: ObjectId, ref: 'User' },
        type: {
            type: String,
            enum: ['friend_request', 'friend_accept', 'like', 'comment', 'message'],
            required: true
        },
        content: String,
        relatedPost: { type: ObjectId, ref: 'Post' },
        relatedConversation: { type: ObjectId, ref: 'Conversation' },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
