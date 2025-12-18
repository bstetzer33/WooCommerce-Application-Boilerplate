import * as SecureStore from 'expo-secure-store';

export const StorageService = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error storing item ${key}:`, error);
      throw error;
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error retrieving item ${key}:`, error);
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  },

  setObject: async <T>(key: string, value: T): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing object ${key}:`, error);
      throw error;
    }
  },

  getObject: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error retrieving object ${key}:`, error);
      return null;
    }
  },

  clear: async (): Promise<void> => {
    try {
      // Note: Expo SecureStore doesn't have a clear all method,
      // so you'd need to track keys separately or use multiple removeItem calls
      const keysToDelete = [
        'auth_token',
        'refresh_token',
        'user_data',
        'cart_data',
        'wishlist_items',
      ];
      for (const key of keysToDelete) {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
