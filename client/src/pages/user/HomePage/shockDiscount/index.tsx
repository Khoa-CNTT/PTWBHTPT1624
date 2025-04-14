import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import { dealFlashIcon } from '../../../../assets';
import { Skeleton } from '@mui/material';
import { IProductItem } from '../../../../interfaces/product.interfaces';
import { apiGetFlashSaleProducts } from '../../../../services/product.service';
import CardShockDiscount from '../../../../components/item/CardShockDiscount';
import { SkeletonProducts } from '../../../../components';

const ShockDiscount: React.FC = () => {
    const [products, setProducts] = useState<IProductItem[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await apiGetFlashSaleProducts();
            if (res.success) setProducts(res.data);
        };
        fetchProducts();
    }, []);

    return (
        <div id="shock-discount" className=" relative flex flex-col w-full  h-auto py-3 pt-8 px-6 bg-white rounded-md  gap-4">
            {/* Updated Header Section */}
            <div className=" w-full flex justify-center items-center">
                {products?.length > 0 ? (
                    <div className="absolute left-1/2 top-[-16px] z-[1] flex w-max min-w-[272px] -translate-x-1/2 items-center justify-center">
                        <p className="relative flex min-h-[34px] w-full items-center justify-center rounded-b-[8px] border-[1px]  border-solid   border-primary px-[7px] py-1 text-16 font-bold uppercase leading-[18px] before:absolute before:left-[-9px] before:top-[-1px] before:border-r-[9px] before:border-t-[16px] before:border-r-primary before:border-t-transparent after:absolute after:right-[-9px] after:top-[-1px] after:border-l-[9px] after:border-t-[16px] after:border-l-primary after:border-t-transparent  bg-bgSecondary text-primary ">
                            Giảm giá sốc
                            <img className="w-[20px] h-[20px] animate-active-flash ml-1" src={dealFlashIcon} alt="Flash Deal Icon" />
                        </p>
                    </div>
                ) : (
                    <Skeleton variant="text" width={'200px'} height={'60px'} />
                )}
            </div>

            {/* Rest of the Component (Unchanged) */}
            <div className="relative">
                {products?.length > 0 ? (
                    <Swiper
                        centeredSlides={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            1: {
                                slidesPerView: 2,
                                slidesPerGroup: 1,
                                allowTouchMove: true,
                            },
                            740: {
                                slidesPerView: 4,
                                slidesPerGroup: 2,
                            },
                            1024: {
                                slidesPerView: 6,
                                slidesPerGroup: 3,
                            },
                        }}>
                        {products.map((p) => (
                            <SwiperSlide key={uuidv4()}>
                                <CardShockDiscount key={p._id} product={p} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <SkeletonProducts index={6} />
                )}
            </div>
        </div>
    );
};

export default ShockDiscount;
