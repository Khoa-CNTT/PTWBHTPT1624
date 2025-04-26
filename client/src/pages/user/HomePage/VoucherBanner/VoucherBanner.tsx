import React, { useEffect, useState } from 'react';
import { apiGetActiveBannerVouchers } from '../../../../services/voucher.service';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate thay cho history

const VoucherBanner: React.FC = () => {
    const [vouchers, setVouchers] = useState<any[]>([]); // Lưu trữ danh sách voucher
    const [currentVoucherIndex, setCurrentVoucherIndex] = useState(0); // Để theo dõi voucher hiện tại
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate(); // Sử dụng useNavigate thay vì history

    useEffect(() => {
        const hasShownBanner = sessionStorage.getItem('voucherBannerShown');
        const justLoggedIn = localStorage.getItem('justLoggedIn');
        const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

        const shouldShow =
            !hasShownBanner && (!isLoggedIn || justLoggedIn === 'true');

        if (shouldShow) {
            const fetchVouchers = async () => {
                try {
                    const response = await apiGetActiveBannerVouchers();
                    if (response.success && response.data?.length > 0) {
                        setVouchers(response.data.slice(0, 3)); // Lấy 3 voucher mới nhất
                        setIsVisible(true);
                        sessionStorage.setItem('voucherBannerShown', 'true');
                    }
                } catch (error) {
                    console.error('Error fetching vouchers:', error);
                } finally {
                    // Dù thành công hay không thì vẫn xóa justLoggedIn để không lặp
                    localStorage.removeItem('justLoggedIn');
                }
            };

            fetchVouchers();
        }
    }, []);

    const closeBanner = () => setIsVisible(false);

    const handleNextVoucher = () => {
        setCurrentVoucherIndex((prevIndex) => (prevIndex + 1) % vouchers.length);
    };

    const handlePrevVoucher = () => {
        setCurrentVoucherIndex(
            (prevIndex) => (prevIndex - 1 + vouchers.length) % vouchers.length
        );
    };

    const handleClickVoucher = () => {
        // Điều hướng đến trang Voucher
        navigate('/voucher'); // Sử dụng navigate thay vì history.push
    };

    if (!isVisible || vouchers.length === 0) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-70 flex justify-center items-center h-full">
            <div className="relative flex gap-4">
                <button
                    onClick={closeBanner}
                    className="absolute -top-4 -right-4 text-white text-2xl hover:text-red-500 transition-colors"
                >
                    <FaTimes />
                </button>
                <div
                    onClick={handleClickVoucher} // Bấm vào ảnh để chuyển đến trang Voucher
                    className="cursor-pointer"
                >
                    <img
                        src={vouchers[currentVoucherIndex]?.voucher_banner_image}
                        alt={vouchers[currentVoucherIndex]?.voucher_name}
                        className="w-[300px] sm:w-[350px] md:w-[400px] h-auto rounded-md shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                </div>
                {/* Nút chuyển qua voucher trước */}
                <button
                    onClick={handlePrevVoucher}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-3xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                >
                    <FaArrowLeft />
                </button>
                {/* Nút chuyển qua voucher sau */}
                <button
                    onClick={handleNextVoucher}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-3xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default VoucherBanner;
