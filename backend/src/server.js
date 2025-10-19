import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import passport from "passport";
import "./config/passport.js";
//Routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { protectRoute } from "./middlewares/auth.middleware.js";

const app = express();

const PORT = ENV.PORT;

//middleware
app.use(express.json({ limit: "30mb" }));
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());
app.use(passport.initialize());

// public routes
app.use("/api/auth", authRoutes);

// private routes
app.use(protectRoute);
app.use("/api/users", userRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`>> Server running on port: ${PORT}`);
            console.log(`>> Server running on host: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    })

