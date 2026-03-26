

// client/src/store/themeStore.js

import { create } from "zustand";

export const useThemeStore = create((set) => ({
  dark: false,
  toggleTheme: () => set((s) => ({ dark: !s.dark })),
}));
