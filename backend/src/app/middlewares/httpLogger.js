import morgan from "morgan";
import chalk from "chalk";
import { log } from "../../utils/logger.js";
import { ENV } from "../../config/env.js";

// ENV.LOG_STATIC = "true" → log cả file tĩnh
const LOG_STATIC = ENV.LOG_STATIC === "true";

export const httpLogger = morgan(
    (tokens, req, res) => {
        const method = tokens.method(req, res);
        const url = tokens.url(req, res);
        const status = Number(tokens.status(req, res));
        const responseTime = Math.round(tokens["response-time"](req, res));

        // Màu cho HTTP method
        const methodColor =
            method === "GET" ? chalk.cyan.bold(method) :
                method === "POST" ? chalk.green.bold(method) :
                    method === "PUT" ? chalk.yellow.bold(method) :
                        method === "DELETE" ? chalk.red.bold(method) :
                            chalk.white.bold(method);

        // Màu cho status code
        const statusColor =
            status >= 500 ? chalk.red(status) :
                status >= 400 ? chalk.yellow(status) :
                    status >= 300 ? chalk.cyan(status) :
                        status >= 200 ? chalk.green(status) :
                            chalk.white(status);

        // Màu cho thời gian phản hồi
        const timeColor =
            responseTime > 1000 ? chalk.red(`${responseTime} ms`) :
                responseTime > 200 ? chalk.yellow(`${responseTime} ms`) :
                    chalk.gray(`${responseTime} ms`);

        // Tính padding để time luôn nằm cuối
        const maxWidth = 100;
        const baseLog = `[${methodColor}] ${url} - ${statusColor}`;
        const paddingLength = Math.max(
            1,
            maxWidth -
            baseLog.replace(/\x1b\[[0-9;]*m/g, "").length -
            responseTime.toString().length -
            3
        );
        const padding = chalk.gray("—".repeat(paddingLength));

        return `${baseLog} ${padding} ${timeColor}`;
    },
    {
        stream: {
            write: (message) => log.info(message.trim()),
        },
        skip: (req) => {
            // Nếu LOG_STATIC=false → bỏ qua file tĩnh
            if (LOG_STATIC) return false;

            const staticExtensions = [
                ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
                ".css", ".js", ".map", ".woff", ".woff2", ".ttf", ".eot"
            ];

            return staticExtensions.some(ext => req.url.endsWith(ext));
        },
    }
);
