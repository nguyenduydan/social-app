// src/utils/compressVideo.worker.js
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

self.onmessage = async (e) => {
    const file = e.data;

    try {
        console.log("🟢 Worker: Khởi tạo FFmpeg...");
        const ffmpeg = new FFmpeg();
        await ffmpeg.load();

        console.log("⚙️ Worker: Bắt đầu nén video...");
        await ffmpeg.writeFile("input.mp4", await fetchFile(file));
        await ffmpeg.exec([
            "-i", "input.mp4",
            "-vcodec", "libx264",
            "-crf", "28",
            "-preset", "fast",
            "-movflags", "faststart",
            "output.mp4",
        ]);

        console.log("✅ Worker: Nén xong!");
        const data = await ffmpeg.readFile("output.mp4");

        const blob = new Blob([data], { type: "video/mp4" });
        const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, "_compressed.mp4"), {
            type: "video/mp4",
        });

        self.postMessage({ success: true, file: compressedFile });
    } catch (err) {
        console.error("❌ Worker: Lỗi khi nén video:", err);
        self.postMessage({ success: false, error: err.message });
    }
};
