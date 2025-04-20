import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/auth.user.service';
import { Overlay, showNotification } from '../../components';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!params.token) navigate('/');
    }, [params.token, navigate]);

    const handleSubmit = async () => {
        if (!params.token || password.length < 6) {
            showNotification('Mật khẩu cần ít nhất 6 ký tự.', false);
            return;
        }
        const res = await resetPassword(params.token, password);
        showNotification(res.message, res.success);
        navigate('/');
    };

    return (
        <Overlay className="bg-gradient-to-tr from-indigo-100 to-blue-100 z-[1000] flex items-center justify-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col gap-6 max-w-sm w-full p-8 bg-white rounded-2xl shadow-2xl">
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-2xl font-bold text-indigo-600">Đặt lại mật khẩu</h2>
                    <p className="text-sm text-gray-600">Nhập mật khẩu mới của bạn để tiếp tục.</p>
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu mới"
                        minLength={6}
                        required
                        className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 pr-10 text-sm text-gray-800 bg-transparent transition-all duration-200"
                    />
                    <div className="absolute right-2 top-2.5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-500 py-2 rounded-md text-white text-base font-medium hover:bg-indigo-600 transition-all duration-200">
                    Tiếp tục
                </button>
            </motion.div>
        </Overlay>
    );
};

export default ForgotPassword;
