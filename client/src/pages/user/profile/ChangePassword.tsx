import React, { useState } from 'react';
import { InputForm, ButtonOutline, showNotification } from '../../../components';
import { apiChangePassword } from '../../../services/user.service';

const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = (password: string) => {
        const minLength = 6;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (password.length < minLength) {
            return "Mật khẩu phải có ít nhất 6 ký tự.";
        }

        if (!specialCharRegex.test(password)) {
            return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
        }

        return "";
    };

    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            showNotification('Vui lòng nhập đầy đủ tất cả các trường', false);
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification('Mật khẩu xác nhận không khớp', false);
            return;
        }

        const passwordValidationMessage = validatePassword(newPassword);
        if (passwordValidationMessage) {
            showNotification(passwordValidationMessage, false);
            return;
        }

        const res = await apiChangePassword(oldPassword, newPassword);
        if (res.success) {
            showNotification('Đổi mật khẩu thành công!', true);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            showNotification(`${res.message}`, false);
        }
    };

    return (
        <div className="w-full flex justify-center items-center py-10 border-t border-slate-200">
            <div className="w-full max-w-[500px] flex flex-col gap-6">
                <InputForm
                    label="Mật khẩu cũ :"
                    type="password"
                    name_id="oldPassword"
                    value={oldPassword}
                    handleOnchange={(e) => setOldPassword(e.target.value)}
                />
                <InputForm
                    label="Mật khẩu mới :"
                    type="password"
                    name_id="newPassword"
                    value={newPassword}
                    handleOnchange={(e) => setNewPassword(e.target.value)}
                />
                <InputForm
                    label="Xác nhận mật khẩu mới :"
                    type="password"
                    name_id="confirmPassword"
                    value={confirmPassword}
                    handleOnchange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="flex justify-center">
                    <ButtonOutline
                        className="px-6 py-2 text-white bg-primary"
                        onClick={handlePasswordChange}
                    >
                        Đổi mật khẩu
                    </ButtonOutline>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
