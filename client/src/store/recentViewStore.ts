/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IProductItem } from '../interfaces/product.interfaces';

interface RecentViewState {
    recentViewedProducts: IProductItem[];
    addRecentView: (product: IProductItem) => void;
    removeRecentView: (productId: string) => void;
    clearRecentViews: () => void;
}

const RECENT_VIEW_KEY = 'recentViewedProducts';

const getStoredRecentViews = (): IProductItem[] => {
    try {
        const stored = localStorage.getItem(RECENT_VIEW_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error('Error loading recent views from localStorage:', err);
        return [];
    }
};

const useRecentViewStore = create<RecentViewState>((set) => ({
    recentViewedProducts: getStoredRecentViews(),
    addRecentView: (product) => {
        set((state) => {
            const exists = state.recentViewedProducts.find((p) => p._id === product._id);
            if (exists) return state;
            const updated = [product, ...state.recentViewedProducts].slice(0, 10); // Giới hạn 10 sản phẩm gần đây
            localStorage.setItem(RECENT_VIEW_KEY, JSON.stringify(updated));
            return { recentViewedProducts: updated };
        });
    },

    removeRecentView: (productId) => {
        set((state) => {
            const updated = state.recentViewedProducts.filter((p) => p._id !== productId);
            localStorage.setItem(RECENT_VIEW_KEY, JSON.stringify(updated));
            return { recentViewedProducts: updated };
        });
    },
    clearRecentViews: () => {
        localStorage.removeItem(RECENT_VIEW_KEY);
        set({ recentViewedProducts: [] });
    },
}));

export default useRecentViewStore;
