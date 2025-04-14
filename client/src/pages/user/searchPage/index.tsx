/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Seo from '../../../components/seo';
import SortBar from '../../../components/sortBar';
import queryString from 'query-string';
import { apiSearchProduct } from '../../../services/product.service';
import { IProductItem } from '../../../interfaces/product.interfaces';
import { NotFound, SkeletonProducts } from '../../../components';
import Pagination from '../../../components/pagination';
import ProductItem from '../../../components/item/ProductItem';

const SearchPage: React.FC = () => {
    const location = useLocation();
    const queries = queryString.parse(location.search);
    const [products, setProduct] = useState<IProductItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(Number(queries?.page) || 0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (!params.keySearch) return;
        console.log('queries', queries);
        const fetchProducts = async () => {
            setIsLoading(true);
            const res = await apiSearchProduct(params?.keySearch, {
                limit: 18,
                ...queries,
            });
            setIsLoading(false);
            if (!res.success) return;
            setTotalPage(res?.data.totalPage);
            setProduct(res?.data.products);
        };
        fetchProducts();
    }, [params.keySearch, location.search]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        <div>
            <Seo description={params?.keySearch || ''} title={params.keySearch || ''} key={2} />
            <div className="flex text-2xl p-4 items-center ">
                Kết quả tìm kiếm <h1 className="ml-2 text-3xl text-primary"> "{params.keySearch}"</h1>
            </div>
            <div className="flex flex-col w-full h-full gap-2">
                <SortBar />
                <div className="flex flex-col bg-white pb-8 gap-10">
                    {!isLoading ? (
                        products?.length !== 0 ? (
                            <>
                                <div className="grid mobile:grid-cols-2  tablet:grid-cols-4  laptop:grid-cols-6 ">
                                    {products?.map((p, index) => (
                                        <ProductItem key={p._id} props={p} scrollIntoView={index === 0} />
                                    ))}
                                </div>
                                {totalPage > 0 && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPage={totalPage} />}
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
            </div>
        </div>
    );
};

export default SearchPage;
