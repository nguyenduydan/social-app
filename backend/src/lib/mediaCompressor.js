import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Nén video bằng FFmpeg (ổn định, có kiểm tra audio)
export const compressVideo = async (buffer) => {
    const tempInput = path.join(__dirname, `temp_input_${Date.now()}.mp4`);
    const tempOutput = path.join(__dirname, `temp_output_${Date.now()}.mp4`);

    try {
        // Ghi file tạm
        fs.writeFileSync(tempInput, buffer);
        const inputSizeMB = fs.statSync(tempInput).size / 1024 / 1024;
        console.log(`📥 Video input size: ${inputSizeMB.toFixed(2)} MB`);

        // Kiểm tra metadata để xác định có audio hay không
        const metadata = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(tempInput, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        const hasAudio = metadata.streams.some(
            (s) => s.codec_type === "audio"
        );

        console.log(`🎧 Audio stream detected: ${hasAudio ? "✅ Yes" : "❌ No"}`);

        await new Promise((resolve, reject) => {
            let command = ffmpeg(tempInput)
                .outputOptions([
                    "-c:v libx264",         // video codec
                    "-preset veryfast",     // encode nhanh
                    "-crf 23",              // CRF cao hơn -> nhẹ hơn (~65% giảm size)
                    "-vf scale=-2:1080",     // giảm còn 1080p, giữ tỉ lệ
                    "-movflags +faststart"  // giúp video play sớm khi stream
                ]);

            if (hasAudio) {
                command = command.outputOptions(["-c:a aac", "-b:a 96k"]);
            } else {
                command = command.noAudio(); // nếu không có âm thanh
            }

            command
                .on("start", (cmd) => {
                    console.log("🚀 FFmpeg started:");
                    console.log(cmd);
                })
                .on("end", () => {
                    console.log("✅ FFmpeg compression finished");
                    resolve();
                })
                .on("error", (err) => {
                    console.error("❌ FFmpeg compression error:", err.message);
                    reject(err);
                })
                .save(tempOutput);
        });

        // Kiểm tra kết quả nén
        const inputSize = fs.statSync(tempInput).size;
        const outputSize = fs.statSync(tempOutput).size;
        console.log("📊 Compression result:");
        console.log("- Before:", (inputSize / 1024 / 1024).toFixed(2), "MB");
        console.log("- After:", (outputSize / 1024 / 1024).toFixed(2), "MB");
        console.log("- Compression ratio:", ((outputSize / inputSize) * 100).toFixed(2), "%");

        const compressedBuffer = fs.readFileSync(tempOutput);

        // Dọn file tạm
        fs.unlinkSync(tempInput);
        fs.unlinkSync(tempOutput);

        return compressedBuffer;
    } catch (error) {
        console.error("Video compression failed:", error.message);
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
        return buffer; // fallback nếu nén lỗi
    }
};
