import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { ENV } from "../config/env.js";
import "../config/passport.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { protectRoute } from "./middlewares/auth.middleware.js";
import routes from "./routes/index.js";
import { setupSwagger } from "./docs/swagger.js";
import { httpLogger } from "./middlewares/httpLogger.js";

const app = express();

app.use(express.json({ limit: "30mb" }));
app.use(cookieParser());
app.use(httpLogger);
app.use(passport.initialize());
app.use(
    cors({
        origin: [ENV.CLIENT_URL, "http://localhost:5173"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Swagger docs
setupSwagger(app);

// Public routes
app.use("/api/auth", routes.auth);

// Protected routes
app.use(protectRoute);
app.use("/api/users", routes.users);
app.use("/api/posts", routes.posts);
app.use("/api/friends", routes.friends);
app.use("/api/messages", routes.messages);
app.use("/api/conversations", routes.conversations);

// Global error handler
app.use(errorHandler);

export default app;
