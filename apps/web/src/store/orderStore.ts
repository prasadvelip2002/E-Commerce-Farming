import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

export interface Order {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
  status: 'Processing' | 'Shipped' | 'Delivered';
  paymentMethod: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'agri-order-storage',
    }
  )
);
