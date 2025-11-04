export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.status = statusCode;
        this.name = "AppError";
        Error.captureStackTrace(this, this.constructor);
    }
}

// Helper để tiện sử dụng nhanh
export const createError = (message, status = 400) => new AppError(message, status);
