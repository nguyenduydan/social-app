import express from "express";
import { sendDirectMessage, sendGroupMessage } from "../controllers/MessageController.js";
import { checkFriendship, checkGroupMembership } from "../middlewares/friend.middleware.js";

const router = express.Router();

router.post("/direct", checkFriendship, sendDirectMessage);
router.post("/group", checkGroupMembership, sendGroupMessage);

export default router;
