import { log, startupLog } from "./utils/logger.js";

process.on("uncaughtException", (err) => {
    log.error("Uncaught Exception", err);
});

process.on("unhandledRejection", (reason) => {
    log.error("Unhandled Rejection", reason);
});

const startServer = async () => {
    try {
        const { ENV } = await import("./config/env.js");
        const { connectDB } = await import("./config/db.js");
        const { default: app } = await import("./app/index.js");
        // Kết nối Database
        await connectDB();
        log.info("Connected to MongoDB");

        // Khởi động server
        const server = app.listen(ENV.PORT, () => {
            startupLog(ENV.PORT);
        });

        // // Khởi tạo socket.io
        // import("./socket/index.js").then(({ initSocket }) => {
        //     initSocket(server);
        //     log.info("📡 Socket.IO initialized");
        // });
    } catch (err) {
        log.error("Failed to start server", err);
        process.exit(1);
    }
};

startServer();
