import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import passport from "passport";
import "./config/passport.js";
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
//Routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import friendRoutes from "./routes/friend.route.js";
import messageRoutes from "./routes/message.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import { protectRoute } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { colors, logLine } from "./utils/logger.js";

const app = express();

const PORT = ENV.PORT;

//middleware
app.use(express.json({ limit: "30mb" }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: [ENV.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

//swagger
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", "utf8"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// public routes
app.use("/api/auth", authRoutes);

// private routes
app.use(protectRoute);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// middleware xử lý lỗi chung
app.use(errorHandler);


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logLine(`Server running on host: http://localhost:${PORT}`, colors.cyan);
            logLine(`Press Ctrl + C to exit`, colors.yellow);
            logLine(`To restart at any time, enter "rs"`, colors.yellow);
        });
    })
    .catch((error) => {
        logLine("❌ Failed to start server:", error);
        process.exit(1);
    })

