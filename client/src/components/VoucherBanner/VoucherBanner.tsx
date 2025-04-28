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
        const fetchVouchers = async () => {
            const response = await apiGetActiveBannerVouchers();
            if (response.success && response.data?.length > 0) {
                setVouchers(response.data);
                // Check if banner should be shown based on last closed time
                const lastClosedTime = localStorage.getItem('voucherBannerLastClosed');
                const currentTime = Date.now();
                const fiveMinutesInMs = 30 * 1000; // 5 minutes in milliseconds

                if (!lastClosedTime || currentTime - parseInt(lastClosedTime) >= fiveMinutesInMs) {
                    setIsVisible(true);
                }
            }
        };
        fetchVouchers();
    }, []);

    useEffect(() => {
        if (!isVisible) {
            // Schedule the banner to reappear after 5 minutes
            const fiveMinutesInMs = 30 * 1000; // 5 minutes in milliseconds
            const timer = setTimeout(() => {
                if (vouchers.length > 0) {
                    setIsVisible(true);
                }
            }, fiveMinutesInMs);

            // Cleanup the timer when component unmounts or isVisible changes
            return () => clearTimeout(timer);
        }
    }, [isVisible, vouchers]);

    const handleCloseBanner = () => {
        // Store the current timestamp when banner is closed
        localStorage.setItem('voucherBannerLastClosed', Date.now().toString());
        setIsVisible(false);
    };

    // Không hiển thị gì nếu banner không visible hoặc không có voucher
    if (!isVisible || vouchers.length === 0) return null;

    return (
        <Overlay className="z-[999]" onClick={handleCloseBanner}>
            <div
                className="relative max-w-[390px] h-[500px] mx-4 sm:mx-6 lg:mx-auto bg-white rounded-lg shadow-2xl"
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
