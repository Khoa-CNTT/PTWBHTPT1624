/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IProductItem } from '../interfaces/product.interfaces';

// Trạng thái & hành động của store
interface FavoriteState {
    favoriteProducts: IProductItem[];
    setFavorite: (product: IProductItem) => void;
    removeFavorite: (productId: string) => void;
    setFavoriteProducts: (products: IProductItem[]) => void;
    clearFavorites: () => void;
}

// Lấy dữ liệu từ localStorage
const getStoredFavorites = (): IProductItem[] => {
    try {
        const storedFavorites = localStorage.getItem('favoriteProducts');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        console.error('Error parsing favorite products from localStorage:', error);
        return [];
    }
};

// Tạo Zustand store với localStorage
const useFavoriteStore = create<FavoriteState>((set) => ({
    favoriteProducts: getStoredFavorites(),
    setFavorite: (product) => {
        set((state) => {
            // Tránh thêm sản phẩm trùng lặp
            if (state.favoriteProducts.some((p) => p._id === product._id)) {
                return state;
            }
            const updatedFavorites = [...state.favoriteProducts, product];
            localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
            return { favoriteProducts: updatedFavorites };
        });
    },
    removeFavorite: (productId) => {
        set((state) => {
            const updatedFavorites = state.favoriteProducts.filter((p) => p._id !== productId);
            localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
            return { favoriteProducts: updatedFavorites };
        });
    },
    setFavoriteProducts: (products) => {
        localStorage.setItem('favoriteProducts', JSON.stringify(products));
        set({ favoriteProducts: products });
    },
    clearFavorites: () => {
        localStorage.removeItem('favoriteProducts');
        set({ favoriteProducts: [] });
    },
}));

export default useFavoriteStore;
