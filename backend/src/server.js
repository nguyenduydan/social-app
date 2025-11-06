import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logLine, colors } from "./utils/logger.js";
import app from "./app/index.js";

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            logLine(`Server running at http://localhost:${ENV.PORT}`, colors.green);
            logLine(`Press Ctrl + C to exit`, colors.yellow);
        });
    } catch (err) {
        logLine(`Failed to start server: ${err}`, colors.red);
        process.exit(1);
    }
};

startServer();
