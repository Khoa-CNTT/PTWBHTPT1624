import { create } from 'zustand';
import { IBrand } from '../interfaces/brand.interfaces';

interface BrandStore {
    brands: IBrand[];
    setBrands: (brands: IBrand[]) => void;
}

export const useBrandsStore = create<BrandStore>((set) => ({
    brands: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('brands') || '[]') : [],
    setBrands: (brands) => {
        set({ brands });
        if (typeof window !== 'undefined') {
            localStorage.setItem('brands', JSON.stringify(brands));
        }
    },
}));
