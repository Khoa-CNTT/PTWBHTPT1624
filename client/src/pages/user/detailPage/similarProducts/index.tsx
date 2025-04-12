/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';

import { useParams } from 'react-router-dom';
import { apiGetSimilarProducts } from '../../../../services/product.service';
import { IProductItem } from '../../../../interfaces/product.interfaces';
import ProductItem from '../../../../components/item/ProductItem';

export const SimilarProducts: React.FC<{ productId: string | any }> = ({ productId }) => {
    const [products, setProducts] = useState<IProductItem[]>([]);
    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetSimilarProducts(productId);
            if (res.success) setProducts(res.data);
        };
        fetchApi();
    }, [productId]);
    const params = useParams();
    return (
        <>
            {products?.length > 0 && (
                <div className="relative flex flex-col p-3 rounded-sm bg-white gap-7 mt-5">
                    <div className="absolute left-1/2 top-[-16px] z-[1] flex w-max min-w-[272px] -translate-x-1/2 items-center justify-center">
                        <p className="relative flex min-h-[34px] w-full items-center justify-center rounded-b-[8px] border-[1px]  border-solid   border-primary px-[7px] py-1 text-16 font-bold uppercase leading-[18px] before:absolute before:left-[-9px] before:top-[-1px] before:border-r-[9px] before:border-t-[16px] before:border-r-primary before:border-t-transparent after:absolute after:right-[-9px] after:top-[-1px] after:border-l-[9px] after:border-t-[16px] after:border-l-primary after:border-t-transparent bg-primary text-white">
                            Sản Phẩm Tương Tự
                        </p>
                    </div>
                    <div className="flex w-full h-full">
                        <Swiper
                            loop={false}
                            allowTouchMove={false}
                            navigation={true}
                            slidesPerGroup={3}
                            modules={[Navigation]}
                            className="mySwiper"
                            breakpoints={{
                                1: {
                                    slidesPerView: 2,
                                    allowTouchMove: true,
                                },
                                740: {
                                    slidesPerView: 4,
                                    slidesPerGroup: 2,
                                },
                                1024: {
                                    slidesPerView: 6,
                                },
                            }}>
                            {products?.map((item) => {
                                return (
                                    params.pid !== item._id && (
                                        <SwiperSlide key={uuidv4()}>
                                            <ProductItem props={item} />
                                        </SwiperSlide>
                                    )
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            )}
        </>
    );
};
