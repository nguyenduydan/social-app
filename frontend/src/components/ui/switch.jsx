import { useThemeStore } from "@/store/useThemeStore";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Switch = ({ className }) => {
    const { isDark, toggleTheme } = useThemeStore();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    return (
        <label
            onClick={toggleTheme}
            className={`relative inline-flex items-center justify-center cursor-pointer group select-none overflow-hidden w-8 h-8 md:w-10 md:h-10 ${className}`}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ y: 22, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute flex items-center justify-center w-full h-full"
                    >
                        <Moon className="w-5 h-5 md:w-6 md:h-6 text-sky-500" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute flex items-center justify-center w-full h-full"
                    >
                        <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                    </motion.div>
                )}
            </AnimatePresence>
        </label>
    );
};

export default Switch;
