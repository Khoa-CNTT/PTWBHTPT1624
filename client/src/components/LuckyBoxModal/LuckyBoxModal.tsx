import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { apiPlayLuckyBox } from '../../services/user.service'; // Import API gọi playLuckyBox

interface LuckyBoxModalProps {
    onClose: () => void;
    userId: string; // Thêm userId để gửi tới API
}

const LuckyBoxModal: React.FC<LuckyBoxModalProps> = ({ onClose, userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reward, setReward] = useState<number | string>(''); // Lưu phần thưởng
    const [totalPoints, setTotalPoints] = useState<number | string>(''); // Tổng điểm sau khi nhận thưởng
    const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
    const [error, setError] = useState<string>(''); // Quản lý lỗi
    const [showCongratulation, setShowCongratulation] = useState(false); // Quản lý hiển thị form chúc mừng
    const [openedBox, setOpenedBox] = useState<number | null>(null); // Lưu hộp quà đã mở

    // Hiệu ứng chuyển động cho các hộp quà
    const boxSpring = useSpring({
        to: { transform: openedBox !== null ? 'scale(1.3)' : 'scale(1)', opacity: openedBox !== null ? 0 : 1 },
        from: { transform: 'scale(1)', opacity: 1 },
        reset: true,
        reverse: isOpen ? true : false,
        config: { tension: 120, friction: 14 },
    });

    const handleOpenBox = async (boxNumber: number) => {
        if (!userId) {
            setError('Người dùng không hợp lệ.');
            return;
        }

        setLoading(true);
        setError(''); // Reset error mỗi lần mở hộp
        // Gọi API playLuckyBox và truyền boxNumber
        const res = await apiPlayLuckyBox(userId);  // Truyền boxNumber vào API
        if (res.success) {
            setReward(res.data.rewardPoints); // Lưu phần thưởng nhận được
            setTotalPoints(res.data.totalPoints); // Lưu tổng điểm mới
            setShowCongratulation(true); // Hiển thị form chúc mừng
            setOpenedBox(boxNumber); // Đánh dấu hộp đã mở
        } else {
            setReward('Không thể nhận thưởng!'); // Trường hợp lỗi
            setTotalPoints(''); // Reset totalPoints
        }
        setLoading(false);
        setIsOpen(true);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-lg w-full max-w-lg shadow-2xl transform transition-all scale-100 hover:scale-105 duration-300">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Chúc mừng bạn!</h2>
                    <p className="text-lg text-gray-200">Chọn một hộp quà để nhận thưởng!</p>
                </div>

                <div className="flex justify-center gap-8 mb-6">
                    {/* Hộp 1 */}
                    <animated.button
                        style={boxSpring}
                        className={`bg-gradient-to-r from-green-400 to-green-600 p-12 rounded-xl shadow-xl cursor-pointer transform transition-all duration-300 ${openedBox === 1 ? 'scale-125' : 'hover:scale-110'}`}
                        onClick={() => handleOpenBox(1)}
                        disabled={loading || openedBox !== null}
                    >
                        <span className="text-white font-semibold text-xl">Hộp 1</span>
                    </animated.button>

                    {/* Hộp 2 */}
                    <animated.button
                        style={boxSpring}
                        className={`bg-gradient-to-r from-blue-400 to-blue-600 p-12 rounded-xl shadow-xl cursor-pointer transform transition-all duration-300 ${openedBox === 2 ? 'scale-125' : 'hover:scale-110'}`}
                        onClick={() => handleOpenBox(2)}
                        disabled={loading || openedBox !== null}
                    >
                        <span className="text-white font-semibold text-xl">Hộp 2</span>
                    </animated.button>

                    {/* Hộp 3 */}
                    <animated.button
                        style={boxSpring}
                        className={`bg-gradient-to-r from-red-400 to-red-600 p-12 rounded-xl shadow-xl cursor-pointer transform transition-all duration-300 ${openedBox === 3 ? 'scale-125' : 'hover:scale-110'}`}
                        onClick={() => handleOpenBox(3)}
                        disabled={loading || openedBox !== null}
                    >
                        <span className="text-white font-semibold text-xl">Hộp 3</span>
                    </animated.button>
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
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LuckyBoxModal;
