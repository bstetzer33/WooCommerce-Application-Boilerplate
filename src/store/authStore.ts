import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, AuthToken } from '@types/index';
import { StorageService } from '@services/storage';
import { STORAGE_KEYS } from '@constants/index';

interface AuthState {
  user: AuthUser | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: AuthUser) => void;
  setToken: (token: AuthToken) => void;
  login: (user: AuthUser, token: AuthToken) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  restoreToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      login: async (user, token) => {
        set({ isLoading: true });
        try {
          await StorageService.setItem(STORAGE_KEYS.AUTH_TOKEN, token.access_token);
          if (token.refresh_token) {
            await StorageService.setItem(STORAGE_KEYS.REFRESH_TOKEN, token.refresh_token);
          }
          await StorageService.setObject(STORAGE_KEYS.USER, user);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'Failed to save authentication data',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await StorageService.clear();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'Failed to logout',
            isLoading: false,
          });
          throw error;
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      restoreToken: async () => {
        try {
          const token = await StorageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
          const user = await StorageService.getObject<AuthUser>(STORAGE_KEYS.USER);
          
          if (token && user) {
            set({
              token: { access_token: token } as AuthToken,
              user,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Failed to restore token:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
