import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Overlay from '../common/Overlay';
import { dpnAudio, spinAudio, votayAudio } from '../../assets';
import { apiPlayLuckyBox } from '../../services/user.service';
import useUserStore from '../../store/userStore';

const PRIZES = [
    { option: '💵 10.000 xu' },
    { option: '🙁 May mắn lần sau' },
    { option: '🏷️ Phiếu giảm giá' },
    { option: '🔄 1 lượt quay' },
    { option: '🙁 May mắn lần sau' },
    { option: '💸 50.000 xu' },
    { option: '🙁 May mắn lần sau' },
    { option: '🔁 2 lượt quay' },
    { option: '🙁 May mắn lần sau' },
];

const BACKGROUND_COLORS = ['#FFD700', '#FF8C00', '#FF69B4', '#00CED1', '#ADFF2F', '#9370DB', '#00FA9A', '#FF4500', '#20B2AA'];
const TEXT_COLORS = ['#FFFFFF'];

const LuckyWheel: React.FC<{ setGameModalOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setGameModalOpen }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [prizeIndex, setPrizeIndex] = useState(0);
    const [showPrize, setShowPrize] = useState(false);
    const { addRewardPoints, addTicket, user, subtractTicket } = useUserStore();
    const [titleVoucher, setTitleVoucher] = useState<string>('');
    const handleSpin = () => {
        if (isSpinning) return;
        const audio = new Audio(spinAudio);
        audio.play();
        const newPrizeIndex = Math.floor(Math.random() * PRIZES.length);
        setPrizeIndex(newPrizeIndex);
        setIsSpinning(true);
        setShowPrize(false);
    };

    const handleSpinEnd = () => {
        setIsSpinning(false);
        setShowPrize(true);
    };

    const fireConfetti = () => {
        confetti({
            particleCount: 200,
            spread: 110,
            zIndex: 1000,
            origin: { y: 0.3 },
            colors: ['#FFC700', '#FF0000', '#00FF00', '#0000FF'],
        });
    };

    const prizeVariants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 10 } },
        exit: { scale: 0.5, opacity: 0, transition: { duration: 0.4 } },
    };

    useEffect(() => {
        if (!showPrize) return;

        const handlePrize = async () => {
            const currentPrize = PRIZES[prizeIndex].option;
            subtractTicket();
            if (currentPrize === '🙁 May mắn lần sau') {
                const audio = new Audio(dpnAudio);
                audio.play();
                return;
            }

            fireConfetti();

            const audio = new Audio(votayAudio);
            audio.play();
            const res = await apiPlayLuckyBox(prizeIndex);
            if (!res.success) return;
            subtractTicket();

            const data = res.data;
            if (data.type === 'point') {
                addRewardPoints(data.point);
            } else if (data.type === 'ticket') {
                addTicket(data.ticket);
            } else if (data.type === 'voucher') {
                setTitleVoucher(data?.voucher.voucher_name);
            }
            // TODO: Xử lý response nếu cần, ví dụ:
            console.log('Kết quả nhận thưởng:', res);
        };

        handlePrize();
    }, [showPrize, prizeIndex, addRewardPoints, addTicket]);

    return (
        <>
            <AnimatePresence>
                <Overlay
                    onClick={() => setGameModalOpen(false)}
                    className="z-50 flex items-center justify-center min-h-screen font-[Poppins] bg-black bg-opacity-70">
                    <div onClick={(e) => e.stopPropagation()} className="relative text-center">
                        <Wheel
                            mustStartSpinning={isSpinning}
                            prizeNumber={prizeIndex}
                            data={PRIZES}
                            backgroundColors={BACKGROUND_COLORS}
                            textColors={TEXT_COLORS}
                            fontSize={13}
                            textDistance={65}
                            outerBorderColor="#FFD700"
                            outerBorderWidth={8}
                            radiusLineColor="#fff"
                            radiusLineWidth={2}
                            innerRadius={20}
                            spinDuration={0.5}
                            onStopSpinning={handleSpinEnd}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (user.user_spin_turns > 0 && !isSpinning) {
                                    handleSpin();
                                }
                            }}
                            disabled={isSpinning || user.user_spin_turns === 0}
                            className={`mt-6 px-6 py-3 text-lg font-bold rounded-full text-white shadow-md transition-transform duration-300 ${
                                user.user_spin_turns === 0 || isSpinning
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-600 hover:scale-105'
                            }`}>
                            {user.user_spin_turns > 0 ? `🎯 Quay Ngay! (${user.user_spin_turns} lượt còn lại) ` : '😔 Hết lượt quay rồi!'}
                        </button>
                    </div>
                </Overlay>
            </AnimatePresence>

            <AnimatePresence>
                {showPrize && (
                    <motion.div
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPrize(false)}>
                        <motion.div
                            className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-auto"
                            variants={prizeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            <div className="text-4xl mb-4">{PRIZES[prizeIndex].option === '🙁 May mắn lần sau' ? '💔 Rất tiếc!' : '🎉 Xin chúc mừng!'}</div>
                            <p className="text-xl font-semibold mb-4 break-words">
                                {PRIZES[prizeIndex].option === '🙁 May mắn lần sau'
                                    ? 'Chúc bạn may mắn lần sau!'
                                    : `Bạn đã trúng: ${titleVoucher ? titleVoucher : PRIZES[prizeIndex].option}`}
                            </p>
                            <button onClick={() => setShowPrize(false)} className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                                Đóng
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LuckyWheel;
