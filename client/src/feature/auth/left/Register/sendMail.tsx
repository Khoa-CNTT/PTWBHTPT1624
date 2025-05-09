/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { memo, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { apiLoginWithGoogle, apiSendVerificationEmail } from '../../../../services/auth.user.service';
import useAuthStore from '../../../../store/authStore';
import { showNotification } from '../../../../components';
import { useActionStore } from '../../../../store/actionStore';
import useUserStore from '../../../../store/userStore';
interface ModeRegister {
    setModeRegister: React.Dispatch<React.SetStateAction<number>>;
}
const sendMail: React.FC<ModeRegister> = (props) => {
    const { setModeRegister } = props;
    const [emailValue, setEmailValue] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { setEmailToConfirm } = useAuthStore();
    const { setIsLoading } = useActionStore();
    const { loginUser } = useAuthStore();
    const { setUser } = useUserStore();
    const { setOpenFeatureAuth, setFeatureAuth } = useActionStore();
    const handleSummit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const emailRegex = /\b[A-Z0-9._%+-]+@gmail\.com\b/i;
        if (!emailValue) {
            setError('Email không được để trống!');
            return;
        }
        if (!emailRegex.test(emailValue)) {
            setError('Email không hợp lệ!');
            return;
        }
        setIsLoading(true);
        // Gọi API gửi email xác minh
        const res = await apiSendVerificationEmail(emailValue);
        setIsLoading(false);
        if (!res?.success) {
            // Nếu có lỗi (ví dụ: email đã tồn tại), dừng loading và hiển thị thông báo lỗi
            setError(res?.message || 'Lỗi xảy ra. Vui lòng thử lại.');
            return;
        }
        // Nếu không có lỗi, reset error và chuyển sang màn hình tiếp theo
        setError('');
        setModeRegister(1);
        setEmailToConfirm(emailValue);
    };

    const responseGoogle = async (response: any) => {
        const { credential } = response;
        if (!credential) {
            showNotification('Đăng nhập không thành công!', false);
            return;
        }
        setIsLoading(true);
        const res = await apiLoginWithGoogle(credential);
        setIsLoading(false);
        if (res.success) {
            localStorage.setItem('access_token', JSON.stringify(res.data.accessToken));
            showNotification(res.message, true);
            setOpenFeatureAuth(false);
            loginUser();
            setUser(res.data.user);
            // 👉 Thêm để hiển thị lại banner voucher khi vừa đăng nhập
            localStorage.setItem('justLoggedIn', 'true');
            sessionStorage.removeItem('voucherBannerShown');
        } else {
            showNotification('Đăng nhập không thành công!', false);
            return;
        }
    };

    return (
        <>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">Tạo tài khoản </h1>
                <p className="text-base">Vui lòng nhập địa chỉ gmail</p>
            </div>
            <form className="flex flex-col ">
                <div className="border-b-[1px]  py-2">
                    <input
                        type="email"
                        required
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        className="w-full text-lg outline-none border-none "
                        placeholder="dpshopvn@gmail.com"
                    />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex flex-col gap-2 mt-6">
                    <button
                        onClick={handleSummit}
                        className="w-full bg-pink-500 py-2 rounded-sm text-white text-xl font-normal hover:opacity-80  transition duration-200 ">
                        Tiếp tục
                    </button>
                    <p onClick={() => setFeatureAuth(1)} className="text-base text-primary mx-auto cursor-pointer">
                        Đăng nhập
                    </p>
                </div>
            </form>
            <div className="flex flex-col w-full h-full mt-[50px] gap-3">
                <div className="flex relative w-full  before:translate-y-1/2  before:top-1/2 before:bg-bgSecondary  z-10 before:h-[1px] before:absolute before:w-full ">
                    <span className="z-20 mx-auto bg-white px-2">Hoặc tiếp tục bằng</span>
                </div>
                <div className="flex gap-3 justify-center items-center">
                    {/* <img className="w-[50px]" src={logoFb} /> */}
                    {/* <img className="w-[50px]" src={logoGoogle} /> */}
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_GOOGLE_CLIENT_ID}>
                        <GoogleLogin onSuccess={responseGoogle} />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(sendMail);
