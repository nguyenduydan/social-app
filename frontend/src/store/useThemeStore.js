import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create()(
    persist(
        (set, get) => ({
            isDark: false,
            setTheme: (dark) => {
                document.documentElement.classList.toggle("dark", dark);
                set({ isDark: dark });
            },
            toggleTheme: () => {
                set((state) => {
                    const newTheme = !state.isDark;
                    document.documentElement.classList.toggle("dark", newTheme);
                    return { isDark: newTheme };
                });
            },
            applyTheme: () => {
                const dark = get().isDark;
                document.documentElement.classList.toggle("dark", dark);
            },
        }),
        {
            name: "theme-storage",
        }
    )
);
