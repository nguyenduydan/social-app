import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";


const app = express();

const PORT = ENV.PORT;

//middleware
app.use(express.json({ limit: "30mb" }));
// app.use(cors({

// }))
app.options("*", cors());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.send("Hello world");
});
app.use("/api/auth", authRoutes);


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

