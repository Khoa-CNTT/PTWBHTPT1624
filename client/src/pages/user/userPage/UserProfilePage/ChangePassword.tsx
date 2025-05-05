import React, { useState, useEffect } from 'react';
import { InputForm, ButtonOutline, showNotification } from '../../../../components';
import { apiChangePassword } from '../../../../services/user.service';

const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLengthValid, setIsLengthValid] = useState<boolean>(false);
    const [hasNumber, setHasNumber] = useState<boolean>(false);
    const [hasSpecialChar, setHasSpecialChar] = useState<boolean>(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);

    const validatePassword = (password: string) => {
        const minLength = 10;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        const lengthValid = password.length >= minLength;
        const hasNum = /\d/.test(password);
        const specialValid = specialCharRegex.test(password);

        setIsLengthValid(lengthValid);
        setHasNumber(hasNum);
        setHasSpecialChar(specialValid);

        return lengthValid && hasNum && specialValid;
    };

    useEffect(() => {
        setIsPasswordMatch(newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    useEffect(() => {
        validatePassword(newPassword);
    }, [newPassword]);

    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            showNotification('Vui lòng nhập đầy đủ tất cả các trường', false);
            return;
        }
        if (newPassword === oldPassword) {
            showNotification('Mật khẩu mới không được trùng với mật khẩu cũ', false);
            return;
        }

        if (!isPasswordMatch) {
            showNotification('Mật khẩu xác nhận không khớp', false);
            return;
        }

        const isValid = validatePassword(newPassword);
        if (!isValid) {
            showNotification('Mật khẩu phải có ít nhất 10 ký tự, một số và một ký tự đặc biệt.', false);
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
                
                {/* Thanh tiến độ cho mật khẩu mới */}
                <div className="mt-2">
                    <div className="flex gap-1 h-1.5 justify-center">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`w-[10%] h-full rounded-sm transition-all duration-300 ${validCount > i ? getColor() : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>

                    {/* Gợi ý điều kiện dưới thanh tiến độ */}
                    <div className="w-full flex justify-center mt-2">
                        <ul className="text-sm space-y-1 w-[30%] text-left">
                            <li className={getBlinkEffect(isLengthValid)}>• Trên 10 ký tự</li>
                            <li className={getBlinkEffect(hasNumber)}>• Có ít nhất 1 chữ số</li>
                            <li className={getBlinkEffect(hasSpecialChar)}>• Có ít nhất 1 ký tự đặc biệt</li>
                        </ul>
                    </div>
                </div>

                <div className="flex items-center">
                    <InputForm
                        label="Xác nhận mật khẩu mới :"
                        type="password"
                        name_id="confirmPassword"
                        value={confirmPassword}
                        handleOnchange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {confirmPassword && (
                        <span className="ml-2 text-xl">
                            {isPasswordMatch ? (
                                <span className="text-green-500">✅</span>
                            ) : (
                                <span className="text-red-500">❌</span>
                            )}
                        </span>
                    )}
                </div>

                <div className="flex justify-center">
                    <ButtonOutline className="px-6 py-2 text-white bg-primary" onClick={handlePasswordChange}>
                        Đổi mật khẩu
                    </ButtonOutline>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
