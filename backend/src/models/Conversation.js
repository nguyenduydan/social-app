import mongoose from "mongoose";

const participantSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const groupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        _id: false
    }
);

const lastMessageSchema = mongoose.Schema(
    {
        _id: {
            type: String
        },
        content: {
            type: String,
            default: null
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: {
            type: Date,
            default: null
        }
    },
    {
        _id: false
    }
);

const conversationSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['direct', 'group'],
            default: 'direct',
            required: true
        },
        name: String, // for group chats
        participants: {
            type: [participantSchema],
            required: true
        },
        group: {
            type: groupSchema
        },
        lastMessageAt: {
            type: Date
        },
        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        lastMessage: {
            type: lastMessageSchema,
            default: null
        },
        unreadCounts: {
            type: Map,
            of: Number,
            default: {}
        },
        avatar: {
            type: String
        }
    },
    { timestamps: true }
);

conversationSchema.index({
    "participant.userId": 1,
    lastMessageAt: -1
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
