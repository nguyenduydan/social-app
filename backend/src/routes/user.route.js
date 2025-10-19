import express from "express";
import { getMe, test } from "../controllers/UserController.js";

const router = express.Router();

router.get("/me", getMe);// Get current user

// router.get("/test", test);

export default router;
