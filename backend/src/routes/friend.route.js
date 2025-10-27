import express from "express";

const router = express.Router();

router.post("/request/:userId");
router.put("/accept/:userId");
router.put("/reject/:userId"); // Reject friend request
router.delete("/:userId");
router.get("/"); // Get all friends
router.get("/requests");// Get friend requests
router.get("/suggestions"); // Get friend suggestions

export default router;
