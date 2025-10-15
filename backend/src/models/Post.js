import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        author: { type: ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        media: [{
            url: String,
            type: { type: String, enum: ['image', 'video'] },
            publicId: String
        }],
        likes: [{ type: ObjectId, ref: 'User' }],
        comments: [{
            user: { type: ObjectId, ref: 'User' },
            text: String,
            createdAt: Date
        }],
        visibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'friends'
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
