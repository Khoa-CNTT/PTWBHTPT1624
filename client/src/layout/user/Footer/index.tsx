import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import file CSS

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-screen-xl mx-auto px-4 flex justify-between">
                <div className="flex flex-col">
                    <h4 className="text-lg font-bold mb-2">Liên hệ</h4>
                    <p>Địa chỉ: 123 Phan Đăng Lưu</p>
                    <p>Email: Thaianhtai167@gmail.com</p>
                    <p>Điện thoại: +84 774403533</p>
                </div>

                <div className="flex flex-col">
                    <h4 className="text-lg font-bold mb-2">Liên kết nhanh</h4>
                    <ul>
                        <li>
                            <Link to="/" className="text-sm text-gray-400 hover:text-white">
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="text-sm text-gray-400 hover:text-white">
                                Giới thiệu
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="text-sm text-gray-400 hover:text-white">
                                Liên hệ
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="text-sm text-gray-400 hover:text-white">
                                Chính sách bảo mật
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <h4 className="text-lg font-bold mb-2">Theo dõi chúng tôi</h4>
                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/taideptraiz" target="_blank" rel="noopener noreferrer">
                            <img className="w-6 h-6" src="/path-to-facebook-icon.png" alt="Facebook" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img className="w-6 h-6" src="/path-to-instagram-icon.png" alt="Instagram" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Dòng chữ chạy */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 text-white py-3">
                <div className="overflow-hidden whitespace-nowrap">
                    <p className="text-center animate-marquee text-lg font-semibold">
                        Xin cảm ơn quý khách đã ủng hộ! &nbsp; &nbsp; &nbsp;
                        Chúng tôi luôn cố gắng cải thiện chất lượng sản phẩm! &nbsp; &nbsp; &nbsp;
                        Hãy theo dõi chúng tôi để nhận thông báo khuyến mãi mới nhất!
                    </p>
                </div>
            </div>

            <div className="bg-gray-700 text-center py-3 text-sm">
                <p>&copy; 2025 Cty Bán Thực Phẩm. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
