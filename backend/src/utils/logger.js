import { createLogger } from "winston";
import { loggerConfig } from "../config/logger.config.js";
import chalk from "chalk";

export const logger = createLogger(loggerConfig);

export const log = {
    info: (msg) => logger.info(msg),
    warn: (msg) => logger.warn(msg),
    error: (msg, err = null) => {
        if (err) logger.error(`${msg} - ${err.message}\n${err.stack}`);
        else logger.error(msg);
    },
    debug: (msg) => logger.debug(msg),
};

export const startupLog = (port) => {
    const divider = chalk.gray("------------------------------------------------------");
    console.log("\n" + divider);
    console.log(chalk.green.bold("🚀 SERVER STARTED SUCCESSFULLY"));
    console.log(divider);
    console.log(`${chalk.white("🌐  URL:")} ${chalk.cyan(`http://localhost:${port}`)}`);
    console.log(`${chalk.white("📘  Swagger Docs:")} ${chalk.cyan(`http://localhost:${port}/api-docs`)}`);
    console.log(`${chalk.white("🧩  Mode:")} ${chalk.yellow(process.env.NODE_ENV || "development")}`);
    console.log(`${chalk.white("🕒  Started At:")} ${chalk.gray(new Date().toLocaleString())}`);
    console.log(divider + "\n");
};

// Ghi log lỗi toàn cục
process.on("uncaughtException", (err) => {
    log.error("Uncaught Exception", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    log.error("Unhandled Promise Rejection", reason);
});
