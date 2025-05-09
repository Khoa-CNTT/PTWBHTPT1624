/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useAuthStore from '../../../../store/authStore';
import { apiConfirmVerificationEmail, apiSendVerificationEmail } from '../../../../services/auth.user.service';
import { useActionStore } from '../../../../store/actionStore';
import { InputOtp } from 'primereact/inputotp';

interface ModeRegister {
    setModeRegister: React.Dispatch<React.SetStateAction<number>>;
}
const Confirm: React.FC<ModeRegister> = (props) => {
    const { setModeRegister } = props;
    const [waitingTime, setWaitingTime] = useState<number>(30);
    const [sentBack, setSentBack] = useState<boolean>(false);
    const [token, setTokens] = useState<any>('');
    const [error, setError] = useState<string>('');
    const { email } = useAuthStore();
    const { setIsLoading } = useActionStore();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    useEffect(() => {
        let intervalId: any;
        if (waitingTime <= 30 && waitingTime >= 0) {
            intervalId = setInterval(() => {
                setWaitingTime((prevWaitingTime) => prevWaitingTime - 1);
            }, 1000);
        } else {
            setSentBack(true);
            return;
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [waitingTime]);

    const handleSendBack = async () => {
        const res = await apiSendVerificationEmail(email);
        if (res?.success) {
            setSentBack(false);
            setWaitingTime(30);
            setError('');
            setTokens('');
        }
    };
    const handleSummit = async () => {
        if (!token) {
            setError('Vui lòng nhập mã xác minh(OTP)');
            return;
        }
        setIsLoading(true);
        const res = await apiConfirmVerificationEmail(email, token);
        setIsLoading(false);
        if (!res?.success) {
            setError(res?.message);
            return;
        }
        //chuyển sang mode  tiếp theo
        setModeRegister(2);
    };
    return (
        <>
            <div onClick={() => setModeRegister(0)} className="cursor-pointer">
                <ArrowBackIosIcon />
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">Nhập mã xác minh</h1>
                <p className="text-base">Nhập mã xác minh vừa được gửi đến gmail của bạn</p>
            </div>
            <div className="card flex justify-content-center mx-auto my-2">
                <InputOtp value={token} onChange={(e) => setTokens(e.value)} length={6} />
            </div>
            {error && <p className="text-red-400 text-sm mx-auto">{error}</p>}
            <button
                onClick={handleSummit}
                className="w-full bg-pink-500 py-2 rounded-sm text-white text-xl font-normal hover:opacity-80  transition duration-200 ">
                Xác minh
            </button>
            {!sentBack ? (
                <div className="flex flex-col gap-1 w-full h-full ">
                    <p className="flex gap-2 items-center text-secondary text-sm">
                        Gửi lại mã sao
                        <span className="text-base text-primary">{waitingTime}s</span>
                    </p>
                    <p className="text-sm  text-secondary ">Mã xác minh có hiệu lực trong 5 phút</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1 w-full h-full ">
                    <p className="flex gap-2 items-center text-secondary text-sm">
                        Không nhận được?
                        <span className="text-sm text-primary cursor-pointer" onClick={handleSendBack}>
                            Gửi lại mã
                        </span>
                    </p>
                </div>
            )}
        </>
    );
};

export default Confirm;
