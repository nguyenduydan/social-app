import express from "express";
import {
    acceptRequest,
    getAllFriends,
    getFriendRequests,
    getFriendSuggestions,
    rejectRequest,
    removeFriend,
    sendRequest,
    checkStatus,
} from "../controllers/FriendController.js";

const router = express.Router();

// Kiểm tra trạng thái bạn bè giữa 2 người
router.get("/status/:userId", checkStatus);

// Gửi lời mời kết bạn (theo userId của người nhận)
router.post("/request/:userId", sendRequest);

// Chấp nhận lời mời kết bạn (dùng friendshipId)
router.put("/accept/:friendshipId", acceptRequest);

// Từ chối lời mời kết bạn (dùng friendshipId)
router.put("/reject/:friendshipId", rejectRequest);

// Hủy kết bạn / xóa bạn bè (dùng friendshipId)
router.delete("/:friendshipId", removeFriend);

// Lấy danh sách bạn bè
router.get("/", getAllFriends);

// Lấy danh sách lời mời kết bạn đang chờ
router.get("/requests", getFriendRequests);

// Gợi ý bạn bè
router.get("/suggestions", getFriendSuggestions);

export default router;
