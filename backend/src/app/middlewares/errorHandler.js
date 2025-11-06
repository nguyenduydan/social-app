import { ENV } from "../../config/env.js";
import { log } from "../../utils/logger.js";

/**
 * Global Error Handler Middleware
 * Xử lý tất cả lỗi phát sinh trong hệ thống.
 */
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    const errorData = {
        method: req.method,
        url: req.originalUrl,
        status: statusCode,
        message,
        stack: err.stack,
    };

    // Ghi log chi tiết
    if (ENV.APP_ENV === "development") {
        log.error(
            `[${req.method}] ${req.originalUrl} — ${message}\nStatus: ${statusCode}\n${err.stack}`
        );
    } else {
        log.error(
            `[${req.method}] ${req.originalUrl} — ${message} (Status: ${statusCode})`
        );
    }

    // Gửi phản hồi JSON cho client
    const response = {
        success: false,
        message,
    };

    // Dev mode hiển thị chi tiết lỗi
    if (ENV.APP_ENV === "development") {
        response.error = {
            name: err.name,
            stack: err.stack?.split("\n").map((line) => line.trim()),
        };
    }

    return res.status(statusCode).json(response);
};
