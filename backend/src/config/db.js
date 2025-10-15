import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        const { MONGO_URI } = process.env;
        if (!MONGO_URI) throw new Error("MONGO_URI is not set");
        const connect = await mongoose.connect(ENV.MONGO_URI);
        console.log(">> MongoDB connected: ", connect.connection.host);
    } catch (error) {
        console.log("Error connection to MongoDB: ", error);
        process.exit(1);
    }
};
