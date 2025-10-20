import { useThemeStore } from "@/store/useThemeStore";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

const Switch = () => {
    const { isDark, toggleTheme } = useThemeStore();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    return (
        <label className="relative inline-flex items-center cursor-pointer group">
            <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="hidden"
            />

            <span
                className="flex items-center justify-center w-7 h-7 md:h-10 md:w-10 rounded-xl border-2 border-gray-800 bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 [box-shadow:1px_1px_0px_1px_green] group-has-[input:checked]:[box-shadow:1px_1px_0px_1px_#075985] hover:[box-shadow:1px_1px_0px_1px_#1e1e1e] active:scale-70"
            >
                {/* Mặt trăng (Dark Mode) */}
                <Moon
                    className="absolute w-4 h-4 md:w-6 md:h-6 text-sky-700 opacity-0 group-has-[input:checked]:opacity-100
                     rotate-180 group-has-[input:checked]:rotate-0 transition-all duration-500"
                />

                {/* Mặt trời (Light Mode) */}
                <Sun
                    className="absolute w-4 h-4 md:w-6 md:h-6 text-yellow-500 opacity-100 group-has-[input:checked]:opacity-0
                     rotate-0 group-has-[input:checked]:rotate-180 transition-all duration-500"
                />
            </span>
        </label>
    );
};

export default Switch;
