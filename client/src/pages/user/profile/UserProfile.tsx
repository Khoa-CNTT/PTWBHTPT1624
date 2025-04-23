import React, { useEffect, useState } from 'react';
import AvatarUser from './AvatarUser';
import ChangePassword from './ChangePassword';
import useUserStore from '../../../store/userStore';
import { IUserDetail } from '../../../interfaces/user.interfaces';
import { apiGetDetailUser, apiUpdateUser } from '../../../services/user.service';
import { ButtonOutline, InputForm, InputReadOnly, showNotification } from '../../../components';

const UserProfile: React.FC = () => {
    const { user, setUser } = useUserStore();
    const [payload, setPayload] = useState<IUserDetail>(user);
    const [activeTab, setActiveTab] = useState<string>('info');
    const mobile_ui = false;

    const fetchUserDetail = async () => {
        const res = await apiGetDetailUser();
        if (res.success) {
            setUser(res.data);
            setPayload(res.data);
        } else {
            showNotification('Không thể tải hồ sơ người dùng', false);
        }
    };

    const handleOnChangeValue = (e: React.ChangeEvent<HTMLInputElement>, name_id: string): void => {
        setPayload((prevState) => ({ ...prevState, [name_id]: e.target.value }));
    };

    const handleSubmit = async () => {
        const res = await apiUpdateUser(payload._id, payload);
        if (res.success) {
            showNotification('Cập nhật thành công!', true);
            setUser(res.data);
        } else {
            if (res.code === 203) {
                showNotification('Số điện thoại đã được sử dụng bởi người dùng khác', false);
            } else {
                showNotification('Cập nhật thất bại: ' + res.message, false);
            }
        }
    };

    useEffect(() => {
        fetchUserDetail();
    }, []);

    const TABS = [
        { tab: 'info', title: 'Cập nhật thông tin' },
        { tab: 'password', title: 'Đổi mật khẩu' },
    ];

    return (
        <div className="tablet:fixed tablet:top-0 tablet:right-0 tablet:z-[1000] w-full h-full bg-white overflow-hidden p-4 laptop:rounded-lg tablet:overflow-y-scroll">
            <div className="w-full mb-4">
                <h1 className="text-xl">Hồ Sơ Người Dùng</h1>
                <span className="text-sm text-secondary">Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
            </div>

            {/* Tab navigation */}
            <div className="flex tablet:w-full bg-white sticky top-0 border-b-[2px] border-slate-200">
                {TABS.map((tab) => (
                    <div
                        key={tab.tab}
                        className={`flex-1 text-center py-2 cursor-pointer text-sm ${
                            activeTab === tab.tab
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-secondary'
                        }`}
                        onClick={() => setActiveTab(tab.tab)}
                    >
                        {tab.title}
                    </div>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content py-6">
                {activeTab === 'info' ? (
                    <div className="flex tablet:flex-col tablet:gap-4 w-full py-10 border-solid border-t-[1px] border-slate-200">
                        {mobile_ui && <AvatarUser setPayload={setPayload} payload={payload} />}
                        <div className="flex flex-col justify-center items-center tablet:w-full w-1/2 gap-6">
                            <InputForm
                                label="Tên người dùng"
                                name_id="user_name"
                                value={payload?.user_name}
                                handleOnchange={(e: any) => handleOnChangeValue(e, 'user_name')}
                            />
                            <InputReadOnly label="Email" value={payload.user_email} />
                            <InputForm
                                label="Số điện thoại"
                                name_id="user_mobile"
                                value={payload.user_mobile || ''}
                                handleOnchange={(e: any) => handleOnChangeValue(e, 'user_mobile')}
                            />
                            <InputForm
                                label="Địa chỉ"
                                name_id="user_address"
                                value={payload.user_address || ''}
                                handleOnchange={(e: any) => handleOnChangeValue(e, 'user_address')}
                            />
                            <ButtonOutline className="mx-auto px-6 text-white bg-primary" onClick={handleSubmit}>
                                Cập nhật hồ sơ
                            </ButtonOutline>
                        </div>
                        {!mobile_ui && (
                            <div className="flex flex-col w-1/2 items-center gap-4">
                                <AvatarUser setPayload={setPayload} payload={payload} />
                            </div>
                        )}
                    </div>
                ) : (
                    <ChangePassword />
                )}
            </div>
        </div>
    );
};

export default UserProfile;
