import mongoose from "mongoose";

const friendSchema = mongoose.Schema(
    {
        requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'blocked'],
            default: 'pending'
        },
    },
    { timestamps: true }
);

// Pre-save validation to prevent self-friending
friendSchema.pre('save', function (next) {
    if (this.requester.toString() === this.recipient.toString()) {
        next(new Error('Cannot send friend request to yourself'));
    }
    next();
});

const Friend = mongoose.model("Friend", friendSchema);

export default Friend;
