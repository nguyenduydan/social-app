import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import { log } from "./logger.js";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Tạo file tạm an toàn
 */
const createTempFile = (prefix, ext = ".mp4") =>
    path.join(__dirname, `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);

/**
 * Xóa file nếu tồn tại (an toàn)
 */
const safeDelete = (filePath) => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

/**
 * Lấy metadata video (dùng ffprobe)
 */
export const analyzeVideo = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
};

/**
 * Nén video bằng FFmpeg
 * @param {Buffer} buffer - Video input
 * @returns {Promise<Buffer>} - Nén thành công trả về buffer nén
 */
export const compressVideo = async (buffer) => {
    const tempInput = createTempFile("input");
    const tempOutput = createTempFile("output");

    const startTime = Date.now();

    try {
        fs.writeFileSync(tempInput, buffer);
        const inputSizeMB = (fs.statSync(tempInput).size / 1024 / 1024).toFixed(2);
        log.info(`📥 Input video size: ${inputSizeMB} MB`);

        // Lấy metadata
        const metadata = await analyzeVideo(tempInput);
        const hasAudio = metadata.streams.some((s) => s.codec_type === "audio");
        log.info(`🎧 Audio stream detected: ${hasAudio ? "Yes" : "No"}`);

        // Tạo lệnh FFmpeg
        await new Promise((resolve, reject) => {
            let cmd = ffmpeg(tempInput)
                .outputOptions([
                    "-c:v libx264",
                    "-preset veryfast",
                    "-crf 23",
                    "-vf scale=-2:1080",
                    "-movflags +faststart",
                ])
                .on("start", (commandLine) => log.debug(`FFmpeg started: ${commandLine}`))
                .on("progress", (progress) => {
                    if (progress.percent && progress.percent % 10 < 1) {
                        log.debug(`Progress: ${progress.percent.toFixed(1)}%`);
                    }
                })
                .on("end", resolve)
                .on("error", reject);

            if (hasAudio) cmd = cmd.outputOptions(["-c:a aac", "-b:a 96k"]);
            else cmd = cmd.noAudio();

            cmd.save(tempOutput);
        });

        // Kết quả nén
        const inputSize = fs.statSync(tempInput).size;
        const outputSize = fs.statSync(tempOutput).size;
        const ratio = ((outputSize / inputSize) * 100).toFixed(2);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        log.info("📊 Compression result:");
        log.info(`- Before: ${(inputSize / 1024 / 1024).toFixed(2)} MB`);
        log.info(`- After: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
        log.info(`- Ratio: ${ratio}%`);
        log.info(`- Time: ${duration}s`);

        const compressedBuffer = fs.readFileSync(tempOutput);
        return compressedBuffer;
    } catch (error) {
        log.error(`💥 Video compression failed: ${error.message}`);
        return buffer; // fallback buffer nếu lỗi
    } finally {
        safeDelete(tempInput);
        safeDelete(tempOutput);
    }
};
