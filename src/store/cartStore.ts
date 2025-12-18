import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Cart } from '@types/index';
import { STORAGE_KEYS } from '@constants/index';

interface CartState {
  items: CartItem[];
  subtotal: number;
  total: number;
  tax: number;
  shipping: number;
  discount: number;
  coupon: string | null;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  calculateTotals: (subtotal: number, tax: number, shipping: number, discount: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      total: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      coupon: null,

      addItem: (item) => {
        const state = get();
        const existingItem = state.items.find((i) => i.id === item.id);
        
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          set({ items: [...state.items, item] });
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateItem: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          total: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          coupon: null,
        });
      },

      applyCoupon: (code) => {
        set({ coupon: code });
      },

      removeCoupon: () => {
        set({ coupon: null, discount: 0 });
      },

      calculateTotals: (subtotal, tax, shipping, discount) => {
        const total = Math.max(0, subtotal + tax + shipping - discount);
        set({
          subtotal,
          tax,
          shipping,
          discount,
          total,
        });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
