import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { log } from "../../utils/logger.js";

export const setupSwagger = (app) => {
    try {
        const swaggerDocument = JSON.parse(
            fs.readFileSync("./src/app/docs/swagger.json", "utf8")
        );
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } catch (err) {
        log.error(`Failed to load Swagger docs: ${err}`);
    }
};
