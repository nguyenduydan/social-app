import mongoose from "mongoose";

const friendSchema = mongoose.Schema(
    {
        requester: { type: ObjectId, ref: 'User', required: true },
        recipient: { type: ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'blocked'],
            default: 'pending'
        },
    },
    { timestamps: true }
);

const Friend = mongoose.model("Friend", friendSchema);

export default Friend;
