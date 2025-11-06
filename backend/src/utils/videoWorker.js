import { parentPort, workerData } from "node:worker_threads";
import { compressVideo as compress } from "./mediaCompressorCore.js";

(async () => {
    const result = await compress(workerData);
    parentPort.postMessage(result);
})();
