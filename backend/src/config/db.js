import mongoose from "mongoose";
import { ENV } from "./env.js";
import { logLine } from "../lib/utils.js";

export const connectDB = async () => {
    try {
        const { MONGO_URI } = process.env;
        if (!MONGO_URI) throw new Error("MONGO_URI is not set");
        const connect = await mongoose.connect(ENV.MONGO_URI);
        logLine(">> MongoDB connected: ", connect.connection.host);
    } catch (error) {
        logLine("Error connection to MongoDB: ", error);
        process.exit(1);
    }
};
