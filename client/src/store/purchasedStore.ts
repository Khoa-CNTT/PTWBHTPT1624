/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IPurchasedProduct } from '../interfaces/product.interfaces';

interface PurchasedState {
    purchasedProducts: IPurchasedProduct[];
    setPurchasedProducts: (products: IPurchasedProduct[]) => void;
    setIsReviewedPurchasedProduct: (productId: string) => void;
    clearPurchasedProducts: () => void;
}

const LOCAL_STORAGE_KEY = 'purchasedProducts';

const loadPurchasedFromStorage = (): IPurchasedProduct[] => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading purchased products from localStorage:', error);
        return [];
    }
};

const saveToLocalStorage = (products: IPurchasedProduct[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

const usePurchasedStore = create<PurchasedState>((set) => ({
    purchasedProducts: loadPurchasedFromStorage(),

    setPurchasedProducts: (products) => {
        saveToLocalStorage(products);
        set({ purchasedProducts: products });
    },

    setIsReviewedPurchasedProduct: (productId) => {
        set((state) => {
            const updatedProducts = state.purchasedProducts.map((product) =>
                product.pc_productId._id === productId ? { ...product, pc_isReviewed: true } : product,
            );
            saveToLocalStorage(updatedProducts);
            return { purchasedProducts: updatedProducts };
        });
    },

    clearPurchasedProducts: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        set({ purchasedProducts: [] });
    },
}));

export default usePurchasedStore;
