import React, { useState } from 'react';
import { sendForgotPasswordEmail } from '../../../../services/auth.user.service';
import { showNotification } from '../../../../components';
import { useActionStore } from '../../../../store/actionStore';

const Forgot: React.FC = () => {
    const [emailValue, setEmailValue] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { setOpenFeatureAuth, setIsLoading } = useActionStore();

    const handleForgetPassword = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError(''); // Reset error trước khi bắt đầu xử lý

        // Kiểm tra định dạng email
        const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i;
        if (!emailValue) {
            setError('Email không được để trống!');
            return;
        }
        if (!emailRegex.test(emailValue)) {
            setError('Email không hợp lệ!');
            return;
        }

        setIsLoading(true);
        // Gọi API để gửi email quên mật khẩu
        const res = await sendForgotPasswordEmail({ email: emailValue });
        setIsLoading(false);
        if (!res.success) {
            showNotification(res.message, false);
            return;
        }
        setOpenFeatureAuth(false);
        showNotification('Vui lòng kiểm tra gmail của bạn!', true);
    };

    return (
        <>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">Quên mật khẩu</h1>
                <p className="text-base">Vui lòng nhập địa chỉ email của bạn</p>
            </div>
            <form className="flex flex-col ">
                <div className="border-b-[1px] py-2">
                    <input
                        type="email"
                        required
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        className="w-full text-lg outline-none border-none"
                        placeholder="dpshopvn@gmail.com"
                    />
                </div>
                {/* Hiển thị lỗi nếu có */}
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex flex-col gap-2 mt-6">
                    <button
                        onClick={handleForgetPassword}
                        className="w-full bg-pink-500 py-2 rounded-sm text-white text-xl font-normal hover:opacity-80 transition duration-200">
                        Tiếp tục
                    </button>
                </div>
            </form>
        </>
    );
};

export default Forgot;
