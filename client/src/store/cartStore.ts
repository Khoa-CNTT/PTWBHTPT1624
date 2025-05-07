/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IProductInCart } from '../interfaces/cart.interfaces';

interface CartState {
    orderInfo: any;
    selectedProducts: IProductInCart[];
    productInCart: IProductInCart[];
    setAddProductInCartFromApi: (products: IProductInCart[]) => void;
    setSelectedProduct: (product: IProductInCart) => void;
    setSelectedProductAll: (products: IProductInCart[]) => void;
    setSelectedProductEmpty: () => void;
    setIncreaseProduct: (productId: string) => void;
    setDecreaseProduct: (productId: string) => void;
    setRemoveProductInCart: (productId: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOrderInfo: (orderInfo: any) => void;
}

export const useCartStore = create<CartState>((set) => ({
    selectedProducts: JSON.parse(localStorage.getItem('selectedProducts') || '[]'),
    productInCart: JSON.parse(localStorage.getItem('productInCart') || '[]'),
    productsByShopId: [],
    orderInfo: null,

    setAddProductInCartFromApi: (products) => {
        set((state) => {
            const newState = { ...state, productInCart: products };
            localStorage.setItem('productInCart', JSON.stringify(products));
            return newState;
        });
    },

    setSelectedProduct: (product) => {
        set((state) => {
            const isSelected = state.selectedProducts.some((i) => i.productId === product.productId);
            const newSelectedProducts = isSelected
                ? state.selectedProducts.filter((i) => i.productId !== product.productId)
                : [...state.selectedProducts, product];
            localStorage.setItem('selectedProducts', JSON.stringify(newSelectedProducts));
            return { ...state, selectedProducts: newSelectedProducts };
        });
    },

    setSelectedProductAll: (products) => {
        set((state) => {
            const newSelectedProducts = state.selectedProducts.length === products.length ? [] : products;
            localStorage.setItem('selectedProducts', JSON.stringify(newSelectedProducts));
            return { ...state, selectedProducts: newSelectedProducts };
        });
    },

    setSelectedProductEmpty: () => {
        set((state) => {
            localStorage.setItem('selectedProducts', JSON.stringify([]));
            return { ...state, selectedProducts: [], productsByShopId: [] };
        });
    },

    setIncreaseProduct: (productId) => {
        set((state) => {
            const newProductInCart = state.productInCart.map((product) => {
                if (product.productId === productId) {
                    return {
                        ...product,
                        quantity: product.quantity + 1,
                        // totalPrice: product.totalPrice + product.productId.new_price,
                    };
                }
                return product;
            });
            const newSelectedProducts = state.selectedProducts.map((product) => {
                if (product.productId === productId) {
                    return {
                        ...product,
                        quantity: product.quantity + 1,
                        // totalPrice: product.totalPrice + product.productId.new_price,
                    };
                }
                return product;
            });
            localStorage.setItem('selectedProducts', JSON.stringify(newSelectedProducts));
            localStorage.setItem('productInCart', JSON.stringify(newProductInCart));
            return {
                ...state,
                productInCart: newProductInCart,
                selectedProducts: newSelectedProducts,
            };
        });
    },

    setDecreaseProduct: (productId) => {
        set((state) => {
            const newProductInCart = state.productInCart.map((product) => {
                if (product.productId === productId) {
                    if (product.quantity > 1) {
                        return {
                            ...product,
                            quantity: product.quantity - 1,
                        };
                    }
                    return {
                        ...product,
                        quantity: 1,
                    };
                }
                return product;
            });
            const newSelectedProducts = state.selectedProducts.map((product) => {
                if (product.productId === productId) {
                    if (product.quantity > 1) {
                        return {
                            ...product,
                            quantity: product.quantity - 1,
                        };
                    }
                    return {
                        ...product,
                        quantity: 1,
                    };
                }
                return product;
            });
            localStorage.setItem('selectedProducts', JSON.stringify(newSelectedProducts));
            localStorage.setItem('productInCart', JSON.stringify(newProductInCart));
            return {
                ...state,
                productInCart: newProductInCart,
                selectedProducts: newSelectedProducts,
            };
        });
    },

    setRemoveProductInCart: (productId) => {
        set((state) => {
            const newSelectedProducts = state.selectedProducts.filter((item) => item.productId !== productId);
            const newProductInCart = state.productInCart.filter((item) => item.productId !== productId);
            localStorage.setItem('selectedProducts', JSON.stringify(newSelectedProducts));
            localStorage.setItem('productInCart', JSON.stringify(newProductInCart));
            return {
                ...state,
                selectedProducts: newSelectedProducts,
                productInCart: newProductInCart,
            };
        });
    },

    setOrderInfo: (orderInfo) => {
        set((state) => ({ ...state, orderInfo }));
    },
}));
