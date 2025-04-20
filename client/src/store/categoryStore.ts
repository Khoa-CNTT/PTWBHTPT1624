import { create } from 'zustand';
import { ICategory } from '../interfaces/category.interfaces';

interface CategoriesStore {
    categories: ICategory[];
    setCategories: (categories: ICategory[]) => void;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
    categories: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('categories') || '[]') : [],
    setCategories: (categories) => {
        set({ categories });
        if (typeof window !== 'undefined') {
            localStorage.setItem('categories', JSON.stringify(categories));
        }
    },
}));
