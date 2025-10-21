import imageCompression from "browser-image-compression";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";


export const compressImage = async (file) => {
    try {
        const options = {
            maxSizeMB: 1, // Giới hạn 1MB
            maxWidthOrHeight: 1920, // Giữ ảnh dưới 1920px
            useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error("Error compressing image:", error);
        return file; // fallback
    }
};


//  🔹 Khởi tạo FFmpeg(load 1 lần duy nhất)

let ffmpegInstance = null;
let isLoaded = false;

// 🔹 Khởi tạo FFmpeg chỉ 1 lần
export const getFFmpeg = async () => {
    if (!ffmpegInstance) {
        console.log("🟢 Khởi tạo FFmpeg...");
        ffmpegInstance = new FFmpeg();

        // Log để debug
        ffmpegInstance.on('log', ({ message }) => {
            console.log('FFmpeg:', message);
        });
    }

    if (!isLoaded) {
        console.log("⏳ Đang load FFmpeg core...");
        try {
            const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';

            // toBlobURL được dùng để bypass CORS issue
            await ffmpegInstance.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            isLoaded = true;
            console.log("✅ FFmpeg đã load xong!");
        } catch (err) {
            console.error("❌ Lỗi khi load FFmpeg:", err);
            throw err;
        }
    }

    return ffmpegInstance;
};
/**
 * 🔹 Nén video (theo hướng dẫn mới của ffmpeg.wasm)
 */
export const compressVideo = async (file) => {
    try {
        const ffmpeg = await getFFmpeg();

        console.log("⚙️ Đang nén video...");

        const inputName = 'input.mp4';
        const outputName = 'output.mp4';

        // Ghi file vào FFmpeg virtual filesystem
        await ffmpeg.writeFile(inputName, await fetchFile(file));

        // Thực thi lệnh nén video
        // -crf 28: quality (18-28, càng cao càng nhỏ file)
        // -preset fast: tốc độ encode
        await ffmpeg.exec([
            '-i', inputName,
            '-c:v', 'libx264',
            '-crf', '28',
            '-preset', 'fast',
            '-c:a', 'aac',
            '-b:a', '128k',
            outputName
        ]);

        // Đọc file output
        const data = await ffmpeg.readFile(outputName);

        // Cleanup
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        // Convert về Blob/File
        const blob = new Blob([data.buffer], { type: 'video/mp4' });
        const compressedFile = new File([blob], file.name, { type: 'video/mp4' });

        console.log(`✅ Nén xong: ${file.name}`);
        console.log(`📦 Kích thước: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

        return compressedFile;
    } catch (err) {
        console.error("❌ Lỗi khi nén video:", err);
        throw err;
    }
};
