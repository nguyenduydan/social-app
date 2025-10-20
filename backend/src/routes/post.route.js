import express from 'express';
import { createPost, deletePost, getFeed, getPostById, updatePost } from '../controllers/PostController.js';

const router = express.Router();

router.get("/feed", getFeed); // Get personalized feed
router.get("/:id", getPostById); //get detail post
router.post("/", createPost); //create post
router.put("/:id", updatePost); //update post
router.delete("/:id", deletePost); //delete post
router.post("/:id/like"); // like/unlike post
router.post("/:id/comment"); // add comment
router.delete("/:id/comment/:commentid"); //delete comment

export default router;
