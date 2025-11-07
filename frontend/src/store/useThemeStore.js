import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create()(
    persist(
        (set, get) => ({
            themeMode: "system", // "light" | "dark" | "system"

            // Thay đổi theme mode
            setTheme: (mode) => {
                set({ themeMode: mode });
                const isDark = get().resolveTheme(mode);
                document.documentElement.classList.toggle("dark", isDark);
            },

            // Toggle nhanh giữa sáng/tối (bỏ qua system)
            toggleTheme: () => {
                const { themeMode } = get();
                const newMode = themeMode === "dark" ? "light" : "dark";
                get().setTheme(newMode);
            },

            // Xác định thực tế nên dark hay không (dựa theo system)
            resolveTheme: (mode) => {
                if (mode === "system") {
                    return window.matchMedia("(prefers-color-scheme: dark)").matches;
                }
                return mode === "dark";
            },

            // Gọi khi khởi tạo app (đảm bảo theme áp dụng đúng)
            applyTheme: () => {
                const { themeMode, resolveTheme } = get();
                const isDark = resolveTheme(themeMode);
                document.documentElement.classList.toggle("dark", isDark);
            },
        }),
        {
            name: "theme-storage",
        }
    )
);
