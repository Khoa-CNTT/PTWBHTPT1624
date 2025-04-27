import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { noUser } from '../../../assets';
import { PATH, SIDEBAR_USER } from '../../../utils/const';
import { useActionStore } from '../../../store/actionStore';
import useUserStore from '../../../store/userStore';
import useAuthStore from '../../../store/authStore';
import PaidIcon from '@mui/icons-material/Paid';
import LuckyBoxModal from '../../../components/LuckyBoxModal/LuckyBoxModal';  // Import modal Lucky Box

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setOpenFeatureAuth } = useActionStore();
    const { user } = useUserStore();
    const { isUserLoggedIn } = useAuthStore();
    
    const [isLuckyBoxOpen, setLuckyBoxOpen] = useState(false);  // State to control modal visibility

    useEffect(() => {
        if (location.pathname === PATH.PAGE_USER && !isUserLoggedIn) {
            navigate('/');
            setOpenFeatureAuth(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const handleOpenLuckyBox = () => {
        setLuckyBoxOpen(true);  // Open the Lucky Box modal
    };

    const handleCloseLuckyBox = () => {
        setLuckyBoxOpen(false);  // Close the Lucky Box modal
    };

    return (
        <div className="flex flex-col w-full gap-4 bg-white py-3 rounded-md overflow-hidden">
            <div className="flex gap-2 items-center ml-2">
                <div className="w-11 h-11 overflow-hidden rounded-full border-[1px] border-solid border-separate">
                    <img src={user.user_avatar_url || noUser} className="w-full h-full object-cover block" />
                </div>
                <div className="flex flex-col text-xs text-secondary">
                    Tài khoản của
                    <span className="text-base font-normal text-black ">{user.user_name}</span>
                </div>
            </div>
            <div className="flex flex-col items-center text-center mx-4 justify-center py-2 px-3 bg-yellow-50 rounded-xl border border-yellow-400 shadow-sm">
                <span className="text-[14px] text-gray-900">Điểm hiện có</span>
                <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm mt-1">
                    {user.user_reward_points?.toLocaleString('vi-VN')}
                    <PaidIcon fontSize="small" />
                </div>
                {/* Button to trigger the game */}
                <button
                    className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    onClick={handleOpenLuckyBox}>
                    Nhận điểm
                </button>
            </div>

            <ul className="w-full h-full mt-4">
                {SIDEBAR_USER.map((e) => (
                    <NavLink
                        to={e.path_name}
                        key={e.path_name}
                        className={`flex gap-4 p-2 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer ${
                            location.pathname?.includes(e.path_name) ? 'bg-gray-200' : ''
                        }`}>
                        {e.icon}
                        {e.label}
                    </NavLink>
                ))}
            </ul>

            {/* Lucky Box Modal */}
            {isLuckyBoxOpen && <LuckyBoxModal onClose={handleCloseLuckyBox} userId={user._id} />}
        </div>
    );
};
