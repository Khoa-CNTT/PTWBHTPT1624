import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { apiGetAllBanners } from '../../../../services/banner.service';
import { IBanner } from '../../../../interfaces/banner.interfaces';
import { Link } from 'react-router';
import { Skeleton } from '@mui/material';
import { apiGetAllBrands } from '../../../../services/brand.service';
import { IBrand } from '../../../../interfaces/brand.interfaces';
const Banner: React.FC = () => {
    // const { mobile_ui } = useAppSelector((state) => state.action);
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [brands, setBrands] = useState<IBrand[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            const resBanner = await apiGetAllBanners();
            const resBrand = await apiGetAllBrands();
            if (resBanner?.success) setBanners(resBanner.data);
            if (resBrand?.success) setBrands(resBrand.data);
        };
        fetchProducts();
    }, []);

    return (
        <div className="flex tablet:col  w-full h-full gap-1 mt-4">
            <div className="flex tablet:w-full w-[74%]  h-full  rounded-md overflow-hidden">
                {banners?.length > 0 ? (
                    <Swiper
                        centeredSlides={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        loop={true}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            1: {
                                slidesPerGroup: 1,
                                allowTouchMove: true,
                            },
                            1024: {
                                allowTouchMove: false,
                            },
                        }}>
                        {banners?.map((i) => {
                            return (
                                <SwiperSlide key={i._id}>
                                    <Link to={i.banner_link} className="w-full h-full shrink-0 ">
                                        <img className="w-full h-full object-fill" src={i.banner_imageUrl} alt={i.banner_title} />
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    // <Skeleton variant={'rectangular'} width={'100%'} height={mobile_ui ? '150px' : '304px'} />
                    <Skeleton variant={'rectangular'} width={'100%'} height={'274px'} />
                )}
            </div>
            <div className=" tablet:hidden w-[26%] h-full  pl-4">
                {brands?.length > 0 ? (
                    <Swiper
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        allowTouchMove={false}
                        modules={[Autoplay]}
                        className="mySwiper">
                        {brands?.map((i) => {
                            return (
                                <SwiperSlide key={i._id}>
                                    <Link to={`/danh-muc/${i.brand_slug}`} className="w-full object-fill  overflow-hidden ">
                                        <img className="w-full object-fill rounded-[4px]" src={i?.brand_banner} />
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <Skeleton variant={'rectangular'} width={'100%'} height={'274px'} />
                )}
            </div>
        </div>
    );
};

export default Banner;
