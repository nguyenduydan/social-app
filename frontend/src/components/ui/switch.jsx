import { useEffect, useState } from "react";

const Switch = () => {
    const [isDark, setIsDark] = useState(false);

    // 🔹 Lấy theme từ localStorage khi component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // 🔹 Khi user toggle, cập nhật class + lưu lại localStorage
    useEffect(() => {
        const htmlElement = document.documentElement;
        if (isDark) {
            htmlElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            htmlElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isDark}
                onChange={() => setIsDark(!isDark)}
            />
            <div
                className="w-15 h-6 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 peer-checked:from-gray-400 peer-checked:to-gray-500 transition-all duration-500 after:content-['☀️'] after:absolute after:top-2 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:flex after:items-center after:justify-center after:transition-all after:duration-500 peer-checked:after:translate-x-8 peer-checked:after:content-['🌙'] after:shadow-md after:text-xs"
            ></div>
        </label>
    );
};

export default Switch;
