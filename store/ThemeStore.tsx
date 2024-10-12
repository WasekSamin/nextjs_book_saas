import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    isDarkMode: false,
    toggleDarkMode: (isDark: boolean) => {
        set(() => ({
            isDarkMode: isDark
        }));

        if (isDark) {
            localStorage.setItem("theme", "dark");
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }
}));