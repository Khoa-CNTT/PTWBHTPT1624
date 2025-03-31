export interface IShipping {
    sc_name: string;
    sc_phone: string;
    sc_email: string;
    // Địa chỉ
    sc_address: string;
    // Trạng thái hoạt động của công ty
    sc_active: boolean;
    // Mức giá giao hàng
    sc_shipping_price: number;
    // Thời gian vận chuyển
    sc_delivery_time: {
        from: number; // tối thiểu 7 ngày
        to: number; // tối đa 10 ngày
    };
    _id?: string;
}
