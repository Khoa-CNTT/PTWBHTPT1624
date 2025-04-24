/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBrand } from './brand.interfaces';
import { ICategory } from './category.interfaces';

export interface IProductItem {
    _id: string | any;
    product_code?: string;
    product_name: string;
    product_thumb: string;
    product_price: number;
    product_discount: number;
    product_ratings: number;
    product_discounted_price: number;
    product_quantity: number;
    product_sold: number;
    product_slug: string;
}

export interface IProduct extends IProductItem {
    product_code: string;
    product_views?: number;
    product_images: string[]; // Danh sách ảnh sản phẩm
    product_description: string; // Mô tả sản phẩm
    product_quantity: number; // Số lượng sản phẩm trong kho
    product_expiry_date?: string; // ✅ Hạn sử dụng (ISO string hoặc Date)
    product_attribute: { name: string; value: string }[]; // Thuộc tính sản phẩm
    product_category_id: string; // ID danh mục sản phẩm
    product_brand_id: string; // ID thương hiệu sản phẩm
    product_supplier_id: string; // ID nhà cung cấp sản phẩm
    product_isPublished: boolean; // Trạng thái xuất bản
}
export interface IProductDetail extends IProductItem {
    product_code: string;
    product_views?: number;
    product_likes: number;
    product_images: string[]; // Danh sách ảnh sản phẩm
    product_description: string; // Mô tả sản phẩm
    product_quantity: number; // Số lượng sản phẩm trong kho
    product_expiry_date?: string; // ✅ Hạn sử dụng (ISO string hoặc Date)
    product_attribute: { name: string; value: string }[]; // Thuộc tính sản phẩm
    product_category_id: ICategory; // ID danh mục sản phẩm
    product_brand_id: IBrand; // ID thương hiệu sản phẩm
    product_supplier_id: string; // ID nhà cung cấp sản phẩm
    product_isPublished: boolean; // Trạng thái xuất bản
}

export interface IPurchasedProduct {
    _id: string;
    pc_isReviewed: boolean;
    pc_productId: IProductItem;
    pc_purchaseDate: string;
    pc_quantity: number;
    pc_userId: string;
}
