import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/auth.user.service';
import { Overlay, showNotification } from '../../components';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
import { useActionStore } from '../../store/actionStore';

const ForgotPassword: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLengthValid, setIsLengthValid] = useState<boolean>(false);
    const [hasNumber, setHasNumber] = useState<boolean>(false);
    const [hasSpecialChar, setHasSpecialChar] = useState<boolean>(false);

    const params = useParams();
    const navigate = useNavigate();
    const { setIsLoading } = useActionStore();

    useEffect(() => {
        if (!params.token) navigate('/');
    }, [params.token, navigate]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        setIsLengthValid(value.length > 10);
        setHasNumber(/\d/.test(value));
        setHasSpecialChar(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value));
    };

    const handleSubmit = async () => {
        if (!params.token) {
            navigate('/');
            return;
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{11,}$/;

        if (!passwordRegex.test(password)) {
            showNotification('Mật khẩu phải trên 10 ký tự, chứa ít nhất 1 số và 1 ký tự đặc biệt.', false);
            return;
        }

        setIsLoading(true);
        const res = await resetPassword(params.token, password);
        showNotification(res.message, res.success);
        setIsLoading(false);
        navigate('/');
    };

    // ✅ Đếm điều kiện đúng
    const validCount = [isLengthValid, hasNumber, hasSpecialChar].filter(Boolean).length;

    // ✅ Hàm lấy màu tương ứng
    const getColor = () => {
        if (validCount === 1) return 'bg-red-500';
        if (validCount === 2) return 'bg-yellow-400';
        if (validCount === 3) return 'bg-green-500';
        return 'bg-gray-300';
    };

    return (
        <Overlay className="bg-gradient-to-tr from-indigo-100 to-blue-100 z-[1000] flex items-center justify-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col gap-6 max-w-sm w-full p-8 bg-white rounded-2xl shadow-2xl"
            >
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-2xl font-bold text-indigo-600">Đặt lại mật khẩu</h2>
                    <p className="text-sm text-gray-600">Nhập mật khẩu mới của bạn để tiếp tục.</p>
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Mật khẩu mới"
                        minLength={6}
                        required
                        className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 pr-10 text-sm text-gray-800 bg-transparent transition-all duration-200"
                    />
                    <div
                        className="absolute right-2 top-2.5 text-gray-500 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <VisibilityIcon fontSize="small" />
                        ) : (
                            <VisibilityOffIcon fontSize="small" />
                        )}
                    </div>
                </div>

                {/* ✅ 3 thanh nhỏ đổi màu và sáng dần theo số điều kiện đúng */}
                <div className="flex gap-1 mt-2 h-1.5 justify-center">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`w-1/3 h-full rounded-sm transition-all duration-300 ${
                                validCount > i ? getColor() : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {/* ✅ Gợi ý điều kiện */}
                <ul className="mt-2 text-sm space-y-1">
                    <li className={isLengthValid ? 'text-green-600' : 'text-red-500'}>• Trên 10 ký tự</li>
                    <li className={hasNumber ? 'text-green-600' : 'text-red-500'}>• Có ít nhất 1 chữ số</li>
                    <li className={hasSpecialChar ? 'text-green-600' : 'text-red-500'}>• Có ít nhất 1 ký tự đặc biệt</li>
                </ul>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-500 py-2 rounded-md text-white text-base font-medium hover:bg-indigo-600 transition-all duration-200"
                >
                    Tiếp tục
                </button>
            </motion.div>
        </Overlay>
    );
};

export default ForgotPassword;
