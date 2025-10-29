import express from "express";
import { getMe, getUser, updateUser, uploadAvatar, uploadCoverPhoto, getUserByUsername } from "../controllers/UserController.js";

const router = express.Router();

router.get("/me", getMe);// Get current user
router.get("/:id", getUser);
router.get("/username/:username", getUserByUsername);
router.put("/:id", updateUser);
router.patch("/upload-avatar", uploadAvatar);
router.patch("/upload-cover", uploadCoverPhoto);

export default router;
