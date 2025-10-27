import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import { colors, logLine } from "./utils.js";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Nén video bằng FFmpeg (có log màu + timestamp đẹp)
 */
export const compressVideo = async (buffer) => {
    const tempInput = path.join(__dirname, `temp_input_${Date.now()}.mp4`);
    const tempOutput = path.join(__dirname, `temp_output_${Date.now()}.mp4`);

    try {
        // Ghi file tạm
        fs.writeFileSync(tempInput, buffer);
        const inputSizeMB = fs.statSync(tempInput).size / 1024 / 1024;
        logLine(`📥 Input video size: ${inputSizeMB.toFixed(2)} MB`, colors.cyan);

        // Kiểm tra metadata để xem có audio không
        const metadata = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(tempInput, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        const hasAudio = metadata.streams.some((s) => s.codec_type === "audio");
        logLine(`🎧 Audio stream detected: ${hasAudio ? "✅ Yes" : "❌ No"}`, hasAudio ? colors.green : colors.red);

        // Chạy nén video
        await new Promise((resolve, reject) => {
            let command = ffmpeg(tempInput).outputOptions([
                "-c:v libx264",
                "-preset veryfast",
                "-crf 23",
                "-vf scale=-2:1080",
                "-movflags +faststart",
            ]);

            if (hasAudio) {
                command = command.outputOptions(["-c:a aac", "-b:a 96k"]);
            } else {
                command = command.noAudio();
            }

            command
                .on("start", (cmd) => {
                    logLine("🚀 FFmpeg started", colors.yellow);
                    logLine(cmd, colors.gray);
                })
                .on("end", () => {
                    logLine("✅ FFmpeg compression finished", colors.green);
                    resolve();
                })
                .on("error", (err) => {
                    logLine(`❌ FFmpeg compression error: ${err.message}`, colors.red);
                    reject(err);
                })
                .save(tempOutput);
        });

        // Kết quả nén
        const inputSize = fs.statSync(tempInput).size;
        const outputSize = fs.statSync(tempOutput).size;

        logLine("📊 Compression result:", colors.cyan);
        logLine(`- Before: ${(inputSize / 1024 / 1024).toFixed(2)} MB`, colors.gray);
        logLine(`- After: ${(outputSize / 1024 / 1024).toFixed(2)} MB`, colors.gray);
        logLine(`- Ratio: ${((outputSize / inputSize) * 100).toFixed(2)}%`, colors.yellow);

        const compressedBuffer = fs.readFileSync(tempOutput);

        // Dọn file tạm
        fs.unlinkSync(tempInput);
        fs.unlinkSync(tempOutput);

        return compressedBuffer;
    } catch (error) {
        logLine(`💥 Video compression failed: ${error.message}`, colors.red);
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
        return buffer; // fallback nếu nén lỗi
    }
};
