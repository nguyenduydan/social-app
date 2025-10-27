import { ENV } from "../config/env.js";
import { colors, logLine } from "../lib/utils.js";

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";


    const colorForStatus =
        statusCode >= 500
            ? colors.red
            : statusCode >= 400
                ? colors.yellow
                : colors.green;

    if (ENV.APP_ENV === "development") {
        console.log("\n");

        logLine(`❌ [${req.method}] ${req.originalUrl}`, colorForStatus);
        logLine(`→ Status: ${statusCode}`, colors.yellow);
        logLine(`→ Message: ${message}`, colors.cyan);

        if (err.stack) {
            logLine("📦 Stack Trace:", colors.gray);
            err.stack.split("\n").forEach((line) => {
                logLine(line.trim(), colors.gray);
            });
        }

        console.log("\n"); // kết thúc log
    } else {
        // Production
        const time = new Date().toLocaleTimeString("vi-VN", { hour12: false });
        console.error(`[${time}] ❌ [${req.method}] ${req.originalUrl} — ${message}`);
    }

    // JSON return client
    const errorResponse = {
        success: false,
        message,
    };

    if (ENV.APP_ENV === "development") {
        errorResponse.error = {
            name: err.name,
            stack: err.stack?.split("\n").map((line) => line.trim()),
        };
    }

    return res.status(statusCode).json(errorResponse);
};
