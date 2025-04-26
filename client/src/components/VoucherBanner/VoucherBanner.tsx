import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css'; // Nhập CSS của Swiper
import { apiGetActiveBannerVouchers } from '../../services/voucher.service';
import { IVoucher } from '../../interfaces/voucher.interfaces';
import { Overlay } from '..';

const VoucherBanner: React.FC = () => {
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Chỉ hiển thị banner nếu chưa được hiển thị và người dùng chưa đăng nhập hoặc vừa đăng nhập
        const fetchVouchers = async () => {
            const response = await apiGetActiveBannerVouchers();
            if (response.success && response.data?.length > 0) {
                setVouchers(response.data);
                setIsVisible(true);
            }
        };
        fetchVouchers();
    }, []);

    const handleCloseBanner = () => setIsVisible(false);

    // Không hiển thị gì nếu banner không visible hoặc không có voucher
    if (!isVisible || vouchers.length === 0) return null;

    return (
        <Overlay className="z-[999]" onClick={handleCloseBanner}>
            <div
                className="relative  max-w-[390px] h-[500px] mx-4 sm:mx-6 lg:mx-auto bg-white rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Ngăn đóng banner khi click vào nội dung
            >
                <button
                    onClick={handleCloseBanner}
                    className="absolute -top-4 -right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-red-500 transition-colors duration-300"
                    aria-label="Close voucher banner">
                    <FaTimes className="text-xl" />
                </button>
                <Swiper
                    autoplay={{
                        delay: 10000,
                    }}
                    loop={vouchers.length > 1}
                    allowTouchMove={false}
                    modules={[Autoplay]}
                    className="w-full h-full rounded-lg overflow-hidden">
                    {vouchers.map((voucher) => (
                        <SwiperSlide key={voucher._id}>
                            <Link to="/voucher" onClick={handleCloseBanner} className="block w-full h-full">
                                <img className="w-full h-full object-cover" src={voucher.voucher_banner_image} alt={`Voucher ${voucher._id}`} />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </Overlay>
    );
};

export default VoucherBanner;
