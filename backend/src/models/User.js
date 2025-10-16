import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        password: {
            type: String,
            required: function () {
                // Only require password for local users
                return !this.googleId;
            },
        },
        displayName: {
            type: String,
            required: function () {
                // If no Google account, must have displayName
                return !this.googleId;
            },
            maxlength: 200,
        },
        bio: String,
        avatar: {
            url: String,
            publicId: String
        },
        coverPhoto: {
            url: String,
            publicId: String
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
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
