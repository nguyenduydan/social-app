// utils/mediaCompressor.js
import { Worker } from "node:worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const compressVideo = (buffer) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, "videoWorker.js"), {
            workerData: buffer,
        });
        worker.on("message", resolve);
        worker.on("error", reject);
    });
};
