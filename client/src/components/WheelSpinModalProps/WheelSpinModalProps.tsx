import React, { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { apiPlayVongQuay, apiGetWheelRewards } from '../../services/user.service';
import LuckyBoxModal from '../LuckyBoxModal/LuckyBoxModal';

interface GameWheelModalProps {
  onClose: () => void;
  userId: string;
}

interface RewardItem {
  type: string;
  value?: number;
  voucher_name?: string;
  message?: string;
  label: string;
}

const GameWheelModal: React.FC<GameWheelModalProps> = ({ onClose, userId }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState<string | JSX.Element | null>('');  
  const [error, setError] = useState<string>('');
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showLuckyBoxModal, setShowLuckyBoxModal] = useState(false);
  const [isWheelVisible, setIsWheelVisible] = useState(false); // Chỉ hiển thị khi bấm "Vòng Quay"
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [prizeIndex, setPrizeIndex] = useState(0); // Lưu trữ index của phần thưởng quay tới

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await apiGetWheelRewards();
        if (res.success && Array.isArray(res.data)) {
          setRewards(res.data);
        } else {
          setError('Không thể tải phần thưởng.');
        }
      } catch {
        setError('Có lỗi khi tải phần thưởng.');
      }
    };
    fetchRewards();
  }, []);

  const rewardData = rewards.map((r) => ({ option: r.label }));

  const handleSpinWheel = async () => {
    if (isSpinning || !userId || rewards.length === 0) {
      setError(!userId ? 'Người dùng không hợp lệ.' : rewards.length === 0 ? 'Chưa có phần thưởng.' : '');
      return;
    }

    setIsSpinning(true);  // Đặt trạng thái quay là true khi bắt đầu quay
    setReward(null);
    setError('');

    try {
      const res = await apiPlayVongQuay(userId);

      if (res.success) {
        const rewardItem = rewards.find(
          (r) => r.type === res.data.type && (r.value === res.data.value || r.voucher_name === res.data.voucher_name)
        );

        if (rewardItem) {
          const index = rewards.findIndex(
            (r) => r.type === res.data.type && (r.value === res.data.value || r.voucher_name === res.data.voucher_name)
          );

          setPrizeIndex(index);

          setTimeout(() => {
            // Xử lý kết quả trả về từ API
            if (res.data.type === 'points') {
              setReward(<span>Bạn nhận được <strong>{res.data.value}</strong> điểm thưởng!</span>);
              setTotalPoints((prev) => prev + res.data.value);
            } else if (res.data.type === 'voucher') {
              if (res.data.voucher_name) {
                setReward(
                  <span>
                    Bạn đã có voucher <strong>{res.data.voucher_name}</strong>. 
                    Giá trị đã được chuyển thành <strong>10,000 điểm</strong>!
                  </span>
                );
                setTotalPoints((prev) => prev + 10000);
              } else {
                setReward(<span>Bạn nhận được một <strong>voucher</strong>!</span>);
              }
            } else {
              setReward(<span>{res.data.message}</span>);
            }
            setIsSpinning(false); // Kết thúc quay, đặt lại trạng thái spinning
          }, 4500);
        } else {
          setError('Không tìm thấy phần thưởng hợp lệ.');
          setIsSpinning(false);
        }
      } else {
        setReward('Không thể nhận thưởng!');
        setIsSpinning(false);
      }
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại!');
      setIsSpinning(false);
    }
  };

  const handleOpenLuckyBox = () => {
    setShowLuckyBoxModal(true);
    setIsWheelVisible(false); // Đảm bảo Vòng Quay không hiển thị khi mở Lucky Box
  };

  const handleStartWheel = () => {
    setIsWheelVisible(true);  // Hiển thị vòng quay khi bấm "Vòng Quay"
    setShowLuckyBoxModal(false); // Đảm bảo Lucky Box không hiển thị khi bắt đầu Vòng Quay
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="relative bg-white p-8 pt-12 rounded-2xl w-full max-w-[700px] shadow-2xl">
        
        {/* Nút đóng "X" trong game vòng quay */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-4xl font-bold"
          onClick={onClose}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', textAlign: 'center' }}
        >
          X
        </button>

        {/* Tiêu đề */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">🎉 Chúc mừng bạn!</h2>
          <p className="text-gray-600">Chọn trò chơi để nhận thưởng!</p>
        </div>

        {/* Nút chọn trò chơi */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            className="px-5 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
            onClick={handleStartWheel}
            disabled={isWheelVisible}
          >
            Vòng Quay
          </button>
          <button
            className="px-5 py-3 rounded-lg text-white bg-pink-500 hover:bg-pink-600 transition"
            onClick={handleOpenLuckyBox}
          >
            Lucky Box
          </button>
        </div>

        {/* Hiển thị vòng quay */}
        {isWheelVisible && (
          <div className="flex flex-col items-center relative">
            <Wheel
              mustStartSpinning={isSpinning}
              prizeNumber={prizeIndex} // Dùng prizeIndex đã tính toán
              data={rewardData}
              backgroundColors={['#60A5FA', '#FCD34D']}
              textColors={['#1F2937']}
              fontSize={14}
              outerBorderColor="#d1d5db"
              radiusLineColor="#e5e7eb"
              onStopSpinning={() => {}}
            />
            {/* Mũi tên ở giữa */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                stroke="#000"
                strokeWidth="4"
              >
                <path d="M10 15l10 10 10-10" />
              </svg>
            </div>
            <button
              onClick={handleSpinWheel}
              className="mt-6 px-6 py-3 text-white bg-yellow-500 hover:bg-yellow-600 font-bold rounded-full shadow-md transition"
              disabled={isSpinning}  // Vô hiệu hóa khi đang quay
            >
              {isSpinning ? '...' : 'QUAY'}
            </button>
          </div>
        )}

        {/* Lucky Box Modal */}
        {showLuckyBoxModal && <LuckyBoxModal onClose={() => setShowLuckyBoxModal(false)} userId={userId} />}

        {/* Kết quả */}
        <div className="mt-8 text-center">
          {reward && <p className="text-lg font-semibold text-gray-700">{reward}</p>}
          {totalPoints > 0 && (
            <p className="text-sm text-gray-500 mt-2">Tổng điểm hiện có: {totalPoints}</p>
          )}
          <button
            className="mt-6 px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm transition"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

        {/* Thông báo lỗi */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default GameWheelModal;
