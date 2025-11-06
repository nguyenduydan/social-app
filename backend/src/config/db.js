import mongoose from "mongoose";
import { ENV } from "./env.js";
import { log } from "../utils/logger.js";

export const connectDB = async () => {
    try {
        const { MONGO_URI } = ENV;
        if (!MONGO_URI) throw new Error("MONGO_URI is not set");

        const connection = await mongoose.connect(MONGO_URI);

        log.info(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        log.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};
