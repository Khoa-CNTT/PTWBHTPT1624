import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimilarProducts } from './similarProducts';
import HeaderDetail from './headerDetail';
import ProductDescription from './productDescription';
import Breadcrumbs from './breadcrumbs';
import { apiGetProductById } from '../../../services/product.service';
import { SkeLetonDetailPage } from '../../../components';
import Seo from '../../../components/seo';
import { IProductDetail } from '../../../interfaces/product.interfaces';
const DetailPage: React.FC = () => {
    const [productDetail, setProductDetail] = useState<IProductDetail>();
    const pid = useParams().pid;
    useEffect(() => {
        if (!pid) return;
        const fetchDetail = async () => {
            const res = await apiGetProductById(pid);
            if (res.success) {
                setProductDetail(res.data);
            }
        };
        fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid]);

    useEffect(() => {
        document.querySelector('header')?.scrollIntoView({
            behavior: 'instant',
        });
    }, [pid]);

    return productDetail ? (
        <>
            <Seo description={productDetail.product_name} title={productDetail.product_name} key={2} />
            <Breadcrumbs category={productDetail?.product_category_id} title={productDetail?.product_category_id.category_name} />
            <HeaderDetail productDetail={productDetail} />
            <SimilarProducts productId={productDetail._id} />
            <ProductDescription productDetail={productDetail} />
            {/* <ReviewsProduct productDetail={productDetail} userBought={productDetail.userBought} /> */}
        </>
    ) : (
        <SkeLetonDetailPage />
    );
};

export default DetailPage;
