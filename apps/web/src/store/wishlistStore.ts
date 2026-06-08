import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  farmer: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (item) => {
        set((state) => {
          const exists = state.items.find((i) => i.productId === item.productId);
          if (exists) {
             return { items: state.items.filter((i) => i.productId !== item.productId) };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'agri-wishlist-storage',
    }
  )
);
