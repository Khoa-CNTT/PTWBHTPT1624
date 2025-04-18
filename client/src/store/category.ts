import { create } from 'zustand';
import { ICategory } from '../interfaces/category.interfaces';

interface CategoriesStore {
    categories: ICategory[];
    setCategories: (categories: ICategory[]) => void;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
}));
