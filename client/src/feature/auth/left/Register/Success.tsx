import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useAuthStore from '../../../../store/authStore';
import { apiRegister } from '../../../../services/auth.user.service';
import { showNotification } from '../../../../components';
import { useActionStore } from '../../../../store/actionStore';
import useUserStore from '../../../../store/userStore';

interface ModeRegister {
    setModeRegister: React.Dispatch<React.SetStateAction<number>>;
}

const Success: React.FC<ModeRegister> = ({ setModeRegister }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');

    const [isLengthValid, setIsLengthValid] = useState<boolean>(false);
    const [hasNumber, setHasNumber] = useState<boolean>(false);
    const [hasSpecialChar, setHasSpecialChar] = useState<boolean>(false);

    const { setOpenFeatureAuth, setIsLoading } = useActionStore();
    const { loginUser, email } = useAuthStore();
    const { setUser } = useUserStore();

    const validatePassword = (password: string) => {
        const lengthValid = password.length >= 10;
        const hasNum = /\d/.test(password);
        const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setIsLengthValid(lengthValid);
        setHasNumber(hasNum);
        setHasSpecialChar(specialValid);

        return lengthValid && hasNum && specialValid;
    };

    useEffect(() => {
        validatePassword(password);
    }, [password]);

    const validCount = [isLengthValid, hasNumber, hasSpecialChar].filter(Boolean).length;

    const getColor = () => {
        if (validCount === 1) return 'bg-red-500';
        if (validCount === 2) return 'bg-yellow-400';
        if (validCount === 3) return 'bg-green-500';
        return 'bg-gray-300';
    };

    const getBlinkEffect = (isValid: boolean) => {
        return isValid ? 'text-green-600 blink' : 'text-red-500';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        const isValid = validatePassword(password);
        if (!isValid) {
            return;
        }
        setIsLoading(true);
        const res = await apiRegister(email, password);
        setIsLoading(false);
        if (res?.success) {
            loginUser();
            showNotification('Đăng ký tài khoản thành công!', true);
            localStorage.setItem('access_token', JSON.stringify(res?.data.accessToken));
            setUser(res.data.user);
            setOpenFeatureAuth(false);
        } else {
            showNotification('Đăng ký tài khoản không thành công!', false);
        }
    };

    return (
        <>
            <div onClick={() => setModeRegister(1)} className="cursor-pointer">
                <ArrowBackIosIcon />
            </div>
            <h1 className="text-2xl font-semibold">Tạo tài khoản</h1>
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full gap-2">
                    <label htmlFor="password">Đặt mật khẩu</label>
                    <div className="flex w-full justify-between bg-bgSecondary items-center">
                        <input
                            id="password"
                            required
                            className="text-sm w-full bg-transparent outline-none border-b border-solid py-2"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                                e.preventDefault();
                                setPassword(e.target.value);
                            }}
                            placeholder="Mật khẩu"
                        />
                        <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                            {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                        </div>
                    </div>

                    {/* Thanh độ mạnh mật khẩu */}
                    <div className="flex gap-1 h-1.5 mt-2 justify-start">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={`w-[10%] h-full rounded-sm transition-all duration-300 ${validCount > i ? getColor() : 'bg-gray-300'}`} />
                        ))}
                    </div>

                    {/* Điều kiện mật khẩu */}
                    <div className="w-full flex justify-start mt-2">
                        <ul className="text-sm space-y-1 w-[60%] text-left">
                            <li className={getBlinkEffect(isLengthValid)}>• Trên 10 ký tự</li>
                            <li className={getBlinkEffect(hasNumber)}>• Có ít nhất 1 chữ số</li>
                            <li className={getBlinkEffect(hasSpecialChar)}>• Có ít nhất 1 ký tự đặc biệt</li>
                        </ul>
                    </div>
                </div>

                <button type="submit" className="w-full bg-pink-500 py-2 rounded-sm text-white text-xl font-normal hover:opacity-80 transition duration-200">
                    Tạo tài khoản
                </button>
            </form>
        </>
    );
};

export default Success;
