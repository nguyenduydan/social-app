import express from 'express';
import { upload } from "../middlewares/multer.js";
import { createPost, deletePost, getFeed, getPostById, updatePost } from '../controllers/PostController.js';

const router = express.Router();

router.get("/", getFeed); // Get personalized feed
router.get("/:id", getPostById); //get detail post
router.post("/", upload.array("media", 10), createPost);//create post
router.put("/:id", upload.array("media", 10), updatePost);
router.delete("/:id", deletePost); //delete post
router.post("/:id/like"); // like/unlike post
router.post("/:id/comment"); // add comment
router.delete("/:id/comment/:commentid"); //delete comment

export default router;
