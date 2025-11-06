import mongoose from "mongoose";

const friendSchema = mongoose.Schema(
    {
        requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

// Pre-save validation to prevent self-friending
friendSchema.pre('save', function (next) {
    const a = this.requester.toString();
    const b = this.recipient.toString();

    if (a > b) {
        this.requester = new mongoose.Types.ObjectId(b);
        this.recipient = new mongoose.Types.ObjectId(a);
    }

    if (a === b) {
        next(new Error('Cannot send friend request to yourself'));
    }
    next();
});

friendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Friend = mongoose.model("Friend", friendSchema);

export default Friend;
