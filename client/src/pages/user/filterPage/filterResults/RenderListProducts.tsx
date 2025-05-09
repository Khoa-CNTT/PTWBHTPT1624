/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { IProductItem } from '../../../../interfaces/product.interfaces';
import { apiGetAllProducts } from '../../../../services/product.service';
import { useCategoriesStore } from '../../../../store/categoryStore';
import ProductItem from '../../../../components/item/ProductItem';
import Pagination from '../../../../components/pagination';
import { NotFound, SkeletonProducts } from '../../../../components';

const RenderListProducts: React.FC = () => {
    const location = useLocation();
    const queries = queryString.parse(location.search);
    const [products, setProduct] = useState<IProductItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(Number(queries?.page) || 0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const params = useParams();

    const navigate = useNavigate();
    const { categories } = useCategoriesStore();
    useEffect(() => {
        const { pricefrom, priceto, brand, star, ...rest } = queries;
        const fetchProducts = async () => {
            setIsLoading(true);
            const res = await apiGetAllProducts({
                limit: 24,
                ...rest,
                'product_ratings[gte]': star,
                'product_discounted_price[lte]': priceto,
                'product_discounted_price[gte]': pricefrom,
                product_category_id: categories.filter((c) => c.category_code === params.category_code)[0]?._id,
                product_brand_id: params.brand_id ? params.brand_id : brand,
            });
            setIsLoading(false);
            if (!res.success) return;
            const data = res.data;
            setTotalPage(data.totalPage);
            setProduct(data.products);
        };
        fetchProducts();
    }, [currentPage, params.category_code, location.search, params.brand_id]);

    useEffect(() => {
        setCurrentPage(0);
    }, [params.cid]);

    // cập nhật lại query
    useEffect(() => {
        const { page, ...queryParams } = queries;
        const updatedQueryParams =
            currentPage !== 0
                ? {
                      ...queryParams,
                      page: currentPage,
                  }
                : queryParams;
        const newQuery = queryString.stringify(updatedQueryParams);
        navigate(`?${newQuery}`);
    }, [currentPage]);
    useEffect(() => {
        document.querySelector('header')?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [currentPage, location.search]);
    return (
        <div className="flex flex-col bg-white pb-8 gap-10 z-0">
            {!isLoading ? (
                products?.length !== 0 ? (
                    <>
                        <div className="grid mobile:grid-cols-2  tablet:grid-cols-2  laptop:grid-cols-6 ">
                            {products?.map((p) => (
                                <ProductItem key={uuidv4()} props={p} />
                            ))}
                        </div>
                        {totalPage > 1 && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPage={totalPage - 1} />}
                    </>
                ) : (
                    <div className="px-4 pt-6">
                        <NotFound>Rất tiếc, không tìm thấy sản phẩm phù hợp với lựa chọn của bạn</NotFound>
                    </div>
                )
            ) : (
                <SkeletonProducts index={18} />
            )}
        </div>
    );
};

export default RenderListProducts;
