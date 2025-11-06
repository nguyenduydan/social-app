import express from "express";
import {
    acceptRequest,
    cancelRequest,
    checkStatus,
    getAdvancedFriendSuggestions,
    getAllFriends,
    getFriendRequests,
    getFriendSuggestions,
    rejectRequest,
    removeFriend,
    sendRequest,
} from "../controllers/FriendController.js";

const router = express.Router();

router.get("/status/:userId", checkStatus);

router.post("/requests", sendRequest);
router.get("/requests", getFriendRequests);
router.put("/requests/:requestId/accept", acceptRequest);
router.put("/requests/:requestId/reject", rejectRequest);
router.delete("/requests/:requestId/cancel", cancelRequest);


router.get("/", getAllFriends);
router.delete("/:friendshipId", removeFriend);

router.get("/suggestions", getFriendSuggestions);
router.get("/suggestions/advanced", getAdvancedFriendSuggestions);

export default router;
