import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        displayName: { type: String, required: true, maxlength: 200 },
        bio: String,
        avatar: {
            url: String,
            publicId: String
        },
        coverPhoto: {
            url: String,
            publicId: String
        },
        lastSeen: Date,
        isOnline: Boolean,
        role: {
            type: String,
            enum: ["admin", "user"]
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
