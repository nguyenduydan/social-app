import express from "express";
import { acceptRequest, getAllFriends, getFriendRequests, getFriendSuggestions, rejectRequest, removeFriend, sendRequest } from "../controllers/FriendController.js";

const router = express.Router();

router.post("/request/:userId", sendRequest);
router.put("/accept/:userId", acceptRequest);
router.put("/reject/:userId", rejectRequest); // Reject friend request
router.delete("/:userId", removeFriend);
router.get("/", getAllFriends); // Get all friends
router.get("/requests", getFriendRequests);// Get friend requests
router.get("/suggestions", getFriendSuggestions); // Get friend suggestions

export default router;
