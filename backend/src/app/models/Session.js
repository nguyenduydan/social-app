import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

sessionSchema.index({ expriesAt: 1 }, { expriesAfterSeconds: 0 });

export default mongoose.model('Session', sessionSchema);
