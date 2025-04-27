import React, { useState } from 'react';
import { apiPlayLuckyBox } from '../../services/user.service'; // Import API gọi playLuckyBox

interface LuckyBoxModalProps {
    onClose: () => void;
    userId: string;  // Thêm userId để gửi tới API
}

const LuckyBoxModal: React.FC<LuckyBoxModalProps> = ({ onClose, userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reward, setReward] = useState<number | string>(''); // Lưu phần thưởng
    const [totalPoints, setTotalPoints] = useState<number | string>('');  // Tổng điểm sau khi nhận thưởng
    const [loading, setLoading] = useState(false);  // Quản lý trạng thái loading
    const [error, setError] = useState<string>('');  // Quản lý lỗi
    const [showCongratulation, setShowCongratulation] = useState(false); // Quản lý hiển thị form chúc mừng

    const handleOpenBox = async (boxNumber: number) => {
        if (!userId) {
            setError('Người dùng không hợp lệ.');
            return;
        }

        setLoading(true);
        setError(''); // Reset error mỗi lần mở hộp

        try {
            // Gọi API playLuckyBox
            const res = await apiPlayLuckyBox(userId);
            if (res.success) {
                setReward(res.data.rewardPoints);  // Lưu phần thưởng nhận được
                setTotalPoints(res.data.totalPoints);  // Lưu tổng điểm mới
                setShowCongratulation(true);  // Hiển thị form chúc mừng
            } else {
                setReward('Không thể nhận thưởng!');  // Trường hợp lỗi
                setTotalPoints('');  // Reset totalPoints
            }
        } catch (error) {
            setError('Có lỗi xảy ra, vui lòng thử lại!');
            setReward('');  // Reset reward khi có lỗi
            setTotalPoints('');  // Reset totalPoints khi có lỗi
        } finally {
            setLoading(false);
            setIsOpen(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-8 rounded-lg w-96 shadow-xl transform transition-all scale-100 hover:scale-105 duration-300">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Chúc mừng bạn!</h2>
                    <p className="text-lg text-gray-200">Chọn một hộp quà để nhận thưởng!</p>
                </div>

                <div className="flex justify-center gap-6 mb-6">
                    {/* Hộp 1 */}
                    <button 
                        className="bg-green-500 p-10 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shake"
                        onClick={() => handleOpenBox(1)}
                        disabled={loading}>
                        <span className="text-white font-semibold">Hộp 1</span>
                    </button>

                    {/* Hộp 2 */}
                    <button 
                        className="bg-blue-500 p-10 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shake"
                        onClick={() => handleOpenBox(2)}
                        disabled={loading}>
                        <span className="text-white font-semibold">Hộp 2</span>
                    </button>

                    {/* Hộp 3 */}
                    <button 
                        className="bg-red-500 p-10 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shake"
                        onClick={() => handleOpenBox(3)}
                        disabled={loading}>
                        <span className="text-white font-semibold">Hộp 3</span>
                    </button>
                </div>

                {/* Hiển thị lỗi nếu có */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                {showCongratulation && (
                    <div className="mt-6 text-center">
                        <p className="text-xl font-semibold text-white">
                            Bạn nhận được: <span className="text-yellow-400">{reward}</span> điểm
                        </p>
                        {totalPoints && <p className="text-lg text-gray-200 mt-2">Tổng điểm hiện có: {totalPoints}</p>}
                        <button
                            className="mt-6 px-6 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-md shadow-md transition-all duration-200"
                            onClick={onClose}>
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LuckyBoxModal;
