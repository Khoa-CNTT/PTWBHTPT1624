/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IProductInCart {
    productId: string | any;
    product_name: string;
    product_thumb: string;
    product_discounted_price: number;
    product_slug?: string;
    product_price: number;
    product_discount: number;
    quantity: number;
}
