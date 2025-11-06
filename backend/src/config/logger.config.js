import { format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ENV } from "./env.js";

const { combine, timestamp, printf, colorize, align, json } = format;

const consoleFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    align(),
    printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`)
);

const fileFormat = combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
);

export const loggerConfig = {
    level: ENV.APP_ENV === "production" ? "info" : "debug",
    format: fileFormat,
    transports: [
        new transports.Console({ format: consoleFormat }),
        new DailyRotateFile({
            filename: "logs/system-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: fileFormat,
        }),
        new DailyRotateFile({
            filename: "logs/error-%DATE%.log",
            level: "error",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "30d",
            format: json(),
        }),
        new DailyRotateFile({
            filename: "logs/request-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: json(),
        }),
    ],
};
