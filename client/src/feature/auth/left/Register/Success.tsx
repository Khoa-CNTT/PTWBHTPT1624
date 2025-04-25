import React, { useState } from 'react';
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
const Success: React.FC<ModeRegister> = (props) => {
    const { setModeRegister } = props;
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { setOpenFeatureAuth } = useActionStore();
    const { loginUser, email } = useAuthStore();
    const { setUser } = useUserStore();
    const { setIsLoading } = useActionStore();
    const handleSummit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!password) return;
        if (password?.length < 6) {
            setError('Mật khẩu tối thiểu 6 ký tự!');
        } else {
            setIsLoading(true);
            const res = await apiRegister(email, password);
            if (res?.success) {
                loginUser();
                showNotification('Đăng ký tài khoản thành công!', true);
                localStorage.setItem('access_token', JSON.stringify(res?.data.accessToken));
                setUser(res.data.user);
            } else {
                showNotification('Đăng ký tài khoản không thành công!', false);
            }
            setIsLoading(false);
            setOpenFeatureAuth(false);
        }
    };
    return (
        <>
            <div onClick={() => setModeRegister(1)} className="cursor-pointer">
                <ArrowBackIosIcon />
            </div>
            <h1 className="text-2xl font-semibold">Tạo tài khoản</h1>
            <form className="flex flex-col gap-8">
                <div className="flex flex-col w-full gap-2">
                    <label htmlFor="name">Đặt mật khẩu</label>
                    <div className="flex w-full justify-between bg-bgSecondary items-center">
                        <input
                            id="name"
                            required
                            className=" text-sm w-full bg-transparent outline-none border-solid border-b-[1px] py-2"
                            type={showPassword ? 'text' : 'password'}
                            minLength={6}
                            value={password}
                            onChange={(e) => {
                                e.preventDefault();
                                setPassword(e.target.value);
                            }}
                            placeholder="Mật khẩu"
                        />
                        <div onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                <button
                    onClick={handleSummit}
                    className="w-full bg-pink-500 py-2 rounded-sm text-white text-xl font-normal hover:opacity-80  transition duration-200 ">
                    Tạo tài khoản
                </button>
            </form>
        </>
    );
};

export default Success;
