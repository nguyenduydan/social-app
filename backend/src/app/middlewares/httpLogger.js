import morgan from "morgan";
import chalk from "chalk";
import { log } from "../../utils/logger.js";

export const httpLogger = morgan((tokens, req, res) => {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = Number(tokens.status(req, res));
    const responseTime = tokens["response-time"](req, res);

    // Đặt màu cho method
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
    const time = Math.round(responseTime);
    const timeColor =
        time > 1000 ? chalk.red(`${time} ms`) :
            time > 200 ? chalk.yellow(`${time} ms`) :
                chalk.gray(`${time} ms`);


    // Giới hạn log line dài 80 ký tự (hoặc tự chỉnh)
    const maxWidth = 140;
    const baseLog = `[${methodColor}] ${url} - ${statusColor}`;
    const paddingLength = Math.max(1, maxWidth - baseLog.replace(/\x1b\[[0-9;]*m/g, "").length - responseTime.toString().length - 3);
    const padding = chalk.gray("—".repeat(paddingLength));

    return `${baseLog} ${padding} ${timeColor}`;
}, {
    stream: { write: (message) => log.info(message.trim()) },
});
