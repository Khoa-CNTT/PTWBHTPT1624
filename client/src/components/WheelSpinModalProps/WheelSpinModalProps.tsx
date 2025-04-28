import React, { useState } from 'react';
import { apiPlayVongQuay } from '../../services/user.service';  // Import API gọi playVongQuay
import LuckyBoxModal from '../LuckyBoxModal/LuckyBoxModal';  // Import LuckyBoxModal component

interface GameWheelModalProps {
    onClose: () => void;
    userId: string;
}

const GameWheelModal: React.FC<GameWheelModalProps> = ({ onClose, userId }) => {
    const [isSpinning, setIsSpinning] = useState(false);  // Trạng thái quay
    const [reward, setReward] = useState<string | JSX.Element | null>(''); // Phần thưởng sau khi quay
    const [error, setError] = useState<string>('');  // Quản lý lỗi
    const [totalPoints, setTotalPoints] = useState<number>(0); // Tổng điểm người dùng
    const [showLuckyBoxModal, setShowLuckyBoxModal] = useState(false); // Trạng thái hiển thị LuckyBoxModal
    const [isWheelVisible, setIsWheelVisible] = useState(false); // Trạng thái hiển thị vòng quay

    const handleSpinWheel = async () => {
        // Kiểm tra nếu đang quay thì không cho bấm quay lại
        if (isSpinning) {
            console.log("Đang quay, vui lòng đợi...");
            return;
        }

        // Kiểm tra người dùng hợp lệ
        if (!userId) {
            setError('Người dùng không hợp lệ.');
            return;
        }

        setIsSpinning(true);  // Đánh dấu trạng thái đang quay
        setError('');  // Reset lỗi trước khi quay

        try {
            console.log("Gọi API playVongQuay...");
            const res = await apiPlayVongQuay(userId);  // Gọi API playVongQuay

            if (res.success) {
                // Kiểm tra phần thưởng
                if (res.data.type === 'points') {
                    setReward(<span>Bạn nhận được <strong>{res.data.value}</strong> điểm thưởng!</span>);
                    setTotalPoints((prevPoints) => prevPoints + res.data.value);
                } else if (res.data.type === 'voucher') {
                    setReward(<span>Bạn nhận được một <strong>{res.data.voucher.voucher_name}</strong> voucher!</span>);
                } else {
                    setReward(<span>{res.data.message}</span>);
                }
            } else {
                setReward('Không thể nhận thưởng!');
            }
        } catch (error) {
            setError('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setIsSpinning(false);  // Kết thúc trạng thái quay
        }
    };

    const handleOpenLuckyBox = () => {
        setShowLuckyBoxModal(true);
    };

    const handleStartWheel = () => {
        setIsWheelVisible(true);  // Hiển thị vòng quay khi bấm nút Vòng Quay
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 rounded-lg w-96 shadow-xl transform transition-all scale-100 hover:scale-105 duration-300">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Chúc mừng bạn!</h2>
                    <p className="text-lg text-gray-200">Chọn trò chơi để nhận thưởng!</p>
                </div>

                {/* Game Selection */}
                <div className="flex justify-center gap-6 mb-6">
                    <button
                        className="px-4 py-2 rounded-lg text-white bg-blue-500"
                        onClick={handleStartWheel} // Khi bấm Vòng Quay thì chỉ hiển thị vòng quay
                        disabled={isWheelVisible}>
                        Vòng Quay
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg text-white bg-gray-400"
                        onClick={handleOpenLuckyBox}>
                        Lucky Box
                    </button>
                </div>

                {/* Hiển thị vòng quay nếu nút Vòng Quay đã được bấm */}
                {isWheelVisible && (
                    <div className="relative w-full h-72 rounded-full bg-yellow-50 border-2 border-yellow-500 overflow-hidden mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full border-4 border-gray-500 flex justify-center items-center">
                                <button
                                    onClick={handleSpinWheel}  // Gọi API khi bấm Quay
                                    className="text-xl font-bold bg-yellow-500 p-3 rounded-full shadow-xl hover:bg-yellow-400"
                                    disabled={isSpinning}>
                                    {isSpinning ? 'Đang quay...' : 'Quay'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hiển thị phần thưởng từ API */}
                <div className="mt-6 text-center">
                    {reward && (
                        <p className="text-xl font-semibold text-white">
                            {reward}
                        </p>
                    )}
                    {totalPoints > 0 && (
                        <p className="text-lg text-gray-200 mt-2">Tổng điểm hiện có: {totalPoints}</p>
                    )}
                    <button
                        className="mt-6 px-6 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-md shadow-md transition-all duration-200"
                        onClick={onClose}>
                        Đóng
                    </button>
                </div>

                {/* Hiển thị lỗi nếu có */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Hiển thị LuckyBoxModal nếu được chọn */}
            {showLuckyBoxModal && <LuckyBoxModal onClose={() => setShowLuckyBoxModal(false)} userId={userId} />}
        </div>
    );
};

export default GameWheelModal;
