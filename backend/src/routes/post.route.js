import express from 'express';
import { upload } from "../lib/multer.js";
import { createPost, deletePost, getFeed, getPostById, getPostByUserId, updatePost, updateStatus } from '../controllers/PostController.js';

const router = express.Router();

router.get("/", getFeed); // Get feeds
router.get("/:id", getPostById); //get detail post
router.get("/user/:userId", getPostByUserId); //get posts of personal
router.post("/", upload.array("media", 10), createPost);//create post
router.put("/:id", upload.array("media", 10), updatePost);
router.patch("/status", updateStatus);
router.delete("/:id", deletePost); //delete post
router.post("/:id/like"); // like/unlike post
router.post("/:id/comment"); // add comment
router.delete("/:id/comment/:commentid"); //delete comment

export default router;
