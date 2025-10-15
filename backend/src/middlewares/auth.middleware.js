import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Kiểm tra người dùng đã đăng nhập chưa
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" });

        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
