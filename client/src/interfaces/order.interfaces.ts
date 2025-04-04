export interface Product {
    _id: string;
    product_name: string;
}

export interface OrderProduct {
    _id: string;
    productId: Product;
    quantity: number;
    price: number;
    discount: number;
}

export interface IOrder {
    _id: string;
    order_products: OrderProduct[];
    order_total_price: number;
    order_status: 'pending' | 'confirm' | 'shipped' | 'delivered' | 'cancelled';
    order_code: string;
    order_shipping_address: {
        fullName: string;
        detailAddress: string;
        village: string;
        district: string;
        city: string;
        phone: string;
    };
}
