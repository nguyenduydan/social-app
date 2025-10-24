import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            trim: false,
            maxlength: 100,
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
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
            trim: true,
            maxlength: 200,
        },
        bio: {
            type: String,
            maxlength: 500
        },
        phone: {
            type: String,
            sparse: true,
            trim: true,
            match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
        },
        avatar: {
            url: String, // link CDN de hien thi hinh
            publicId: String //--cloudinary de xoa hinh
        },
        coverPhoto: {
            url: String,
            publicId: String,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        lastSeen: Date,
        role: {
            type: String,
            enum: ["admin", "user"]
        }
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ phone: 1 });

const User = mongoose.model("User", userSchema);

export default User;
