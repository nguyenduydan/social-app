import { useThemeStore } from "@/store/useThemeStore";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

const Switch = ({ className }) => {
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
                className={`flex items-center justify-center w-8 h-8 md:h-12 md:w-12 rounded-full transition-all duration-300 hover:text-foreground hover:bg-secondary/30 dark:hover:bg-muted/60
                        hover:shadow-[0_0_5px_0px_rgba(0,0,0,0.3)]
                        hover:scale-105 active:scale-75 ${className}`}
            >
                {/* Mặt trăng (Dark Mode) */}
                <Moon
                    className="absolute w-4 h-4 md:w-6 md:h-6 text-sky-700 opacity-0 group-has-[input:checked]:opacity-100 translate-y-5 group-has-[input:checked]:translate-y-0 transition-all duration-300"
                />

                {/* Mặt trời (Light Mode) */}
                <Sun
                    className="absolute w-4 h-4 md:w-6 md:h-6 text-yellow-500 opacity-100 group-has-[input:checked]:opacity-0 translate-y-0 group-has-[input:checked]:-translate-y-5 transition-all duration-300"
                />
            </span>
        </label>
    );
};

export default Switch;
