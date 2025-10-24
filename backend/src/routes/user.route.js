import express from "express";
import { getMe, getUser, test, updateUser, uploadAvatar, uploadCoverPhoto } from "../controllers/UserController.js";

const router = express.Router();

router.get("/me", getMe);// Get current user
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.patch("/upload-avatar", uploadAvatar);
router.patch("/upload-cover", uploadCoverPhoto);
// router.get("/test", test);

export default router;
