// src/utils/logger.js
export const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
};

export const logLine = (text, color = colors.reset) => {
    const time = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    console.log(`${colors.green}[${time}]${colors.reset} - ${color}${text}${colors.reset}`);
};

export const logErrorDev = (err, req) => {
    console.log("\n");
    const statusColor =
        err.status >= 500
            ? colors.red
            : err.status >= 400
                ? colors.yellow
                : colors.green;

    logLine(`❌ [${req.method}] ${req.originalUrl}`, statusColor);
    logLine(`→ Status: ${err.status}`, statusColor);
    logLine(`→ Message: ${err.message}`, colors.cyan);

    if (err.stack) {
        logLine("📦 Stack Trace:", colors.gray);
        err.stack.split("\n").forEach((line) => logLine(line.trim(), colors.gray));
    }
    console.log("\n");
};

export const logErrorProd = (err, req) => {
    const time = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    const color =
        err.status >= 500
            ? colors.red
            : err.status >= 400
                ? colors.yellow
                : colors.green;

    console.error(
        `${colors.gray}[${time}]${colors.reset} ${color}❌ [${req.method}] ${req.originalUrl} — ${err.message}${colors.reset}`
    );
};
