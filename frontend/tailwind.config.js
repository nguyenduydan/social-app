/** @type {import('tailwindcss').Config} */
import tailwindcssAnimation from "tailwindcss-animate";

export default {
    darkMode: ["class"], // Cho phép dùng class .dark để chuyển theme
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", // Quét toàn bộ file trong src
    ],
    theme: {
    },
    plugins: [
        tailwindcssAnimation, // nếu bạn dùng animation (shadcn/ui cần)
    ],
};
