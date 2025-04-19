/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';

import Header from './Header';
import ListProducts from './ListProducts';
import { IProductItem } from '../../../../interfaces/product.interfaces';
import { apiGetAllProducts, apiGetNewProducts } from '../../../../services/product.service';
import { SkeletonProducts } from '../../../../components';
import NotExit from '../../../../components/common/NotExit';

const Products: React.FC = () => {
    const [products, setProducts] = useState<IProductItem[]>([]);
    const [hiddenButton, setHiddenButton] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [optionTab, setOptionTab] = useState<number>(0);
    // Hàm fetch products được bọc trong useCallback để tránh tạo lại hàm không cần thiết
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        // Trường hợp optionTab = 0: Lấy sản phẩm mới
        if (optionTab === 1) {
            const res = await apiGetNewProducts();
            if (res.success) {
                setProducts(res.data); // Không cần nối mảng vì đây là danh sách mới
                setHiddenButton(true); // Ẩn nút "Load more" vì không có phân trang
            }
            setIsLoading(false);
            return; // Thoát sớm để không chạy logic bên dưới
        }
        // Định nghĩa queries cho các tab khác
        const queries = optionTab === 2 ? { 'product_price[lte]': 99000 } : optionTab === 3 ? { 'product_price[lte]': 20000 } : {};
        const res = await apiGetAllProducts({ limit: 30, page, ...queries });
        if (res.success) {
            const { data } = res;
            // Kiểm tra nếu đã đến trang cuối
            setHiddenButton(data.totalPage === page);
            // Cập nhật danh sách sản phẩm
            setProducts((prev) => [...prev, ...data.products]);
        }
        setIsLoading(false);
    }, [page, optionTab]);
    // Reset products và page khi optionTab thay đổi
    useEffect(() => {
        setProducts([]);
        setPage(0);
        setHiddenButton(false); // Reset hiddenButton khi tab thay đổi
    }, [optionTab]);
    // Gọi fetchProducts khi page hoặc optionTab thay đổi
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // Chỉ phụ thuộc vào fetchProducts, đã bao gồm page và optionTab

    return (
        <div className="w-full h-full">
            <Header optionTab={optionTab} setOptionTab={setOptionTab} isLoading={isLoading} />
            {isLoading && page === 0 ? (
                <SkeletonProducts index={12} />
            ) : products.length > 0 ? (
                <ListProducts hiddenButton={hiddenButton} products={products} setPage={setPage} />
            ) : (
                <NotExit label="Không có sản phẩm nào để hiển thị" />
            )}
        </div>
    );
};

export default Products;
