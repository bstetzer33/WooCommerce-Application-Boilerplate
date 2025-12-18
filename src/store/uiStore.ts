import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  language: string;
  notificationsEnabled: boolean;
  
  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setLanguage: (language: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  language: 'en',
  notificationsEnabled: true,

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
  setLanguage: (language) => set({ language }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
}));
