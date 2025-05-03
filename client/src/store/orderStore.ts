import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define types for the order data
interface Address {
    fullName: string;
    detailAddress: string | undefined;
    village: string | undefined;
    district: string | undefined;
    city: string | undefined;
    phone: string | undefined;
}

interface Product {
    productId: string;
    quantity: number;
}

interface Order {
    order_shipping_company: string | undefined;
    order_shipping_address: Address | undefined;
    order_payment_method: string | undefined;
    order_products: Product[];
}

interface OrderState {
    order: Order;
    setOrder: (order: Order) => void;
    clearOrder: () => void;
}

// Create the Zustand store with persist middleware
export const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            order: {
                order_shipping_company: undefined,
                order_shipping_address: undefined,
                order_payment_method: undefined,
                order_products: [],
            },
            // Action to update the entire order or parts of it
            setOrder: (order: Order) => {
                console.log(order);
                set({ order });
            },
            // Action to clear all order data
            clearOrder: () =>
                set({
                    order: {
                        order_shipping_company: undefined,
                        order_shipping_address: undefined,
                        order_payment_method: undefined,
                        order_products: [],
                    },
                }),
        }),
        {
            name: 'order-storage', // Unique key for localStorage
            storage: createJSONStorage(() => localStorage), // Use localStorage
        },
    ),
);
