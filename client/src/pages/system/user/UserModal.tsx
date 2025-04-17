/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { IUserProfile } from '../../../interfaces/user.interfaces';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import ImageCropper from '../../../components/ImageCropper';

interface UserModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: IUserProfile | any) => void;
    user?: IUserProfile | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, closeModal, onSave, user }) => {
    const [inputFields, setInputFields] = useState<Partial<IUserProfile>>({
        user_name: '',
        user_email: '',
        user_password: '', // Thêm mật khẩu
        user_address: '',
        user_mobile: '',
        user_avatar_url: '',
        user_isBlocked: false,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);

    useEffect(() => {
        if (user) {
            setInputFields(user);
        }
    }, [user]);

    const handleSave = () => {
        const { user_name, user_email, user_address, user_mobile, user_avatar_url, user_isBlocked, user_password } = inputFields;
        const data = { user_name, user_email, user_address, user_mobile, user_avatar_url, user_isBlocked, user_password };

        if (!validate(data, setInvalidFields)) {
            showNotification('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        // Gửi thông tin đến onSave, nếu có id thì gửi _id cùng với dữ liệu
        onSave(user ? { _id: user._id, ...inputFields } : inputFields);
    };

    const handleInputField = (e: { target: { value: string } }, type: string) => {
        setInputFields((prev) => ({ ...prev, [type]: e.target.value }));
        setInvalidFields((prev: any) => prev.filter((field: { name: string }) => field.name !== type));
    };

    const handleImageUpload = async (image: string, type: string): Promise<void> => {
        try {
            setIsUploading(true);
            const formData: any = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
            const response = await apiUploadImage(formData);
            setInputFields((prev) => ({ ...prev, [type]: response.url }));
            setInvalidFields((prev: any) => prev.filter((field: { name: string }) => field.name !== type));
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h4>

                <div className="mb-4">
                    <InputForm
                        col={true}
                        handleOnchange={(e) => handleInputField(e, 'user_name')}
                        label="Tên người dùng"
                        name_id="user_name"
                        value={inputFields.user_name}
                        invalidFields={invalidFields}
                    />
                </div>

                <div className="mb-4">
                    <InputForm
                        col={true}
                        handleOnchange={(e) => handleInputField(e, 'user_email')}
                        label="Email"
                        name_id="user_email"
                        value={inputFields.user_email}
                        invalidFields={invalidFields}
                    />
                </div>

                <div className="mb-4">
                    <InputForm
                        col={true}
                        handleOnchange={(e) => handleInputField(e, 'user_mobile')}
                        label="Số điện thoại"
                        name_id="user_mobile"
                        value={inputFields.user_mobile}
                        invalidFields={invalidFields}
                    />
                </div>

                <div className="mb-4">
                    <InputForm
                        col={true}
                        handleOnchange={(e) => handleInputField(e, 'user_address')}
                        label="Địa chỉ"
                        name_id="user_address"
                        value={inputFields.user_address}
                        invalidFields={invalidFields}
                    />
                </div>

                {/* Thêm trường mật khẩu */}
                <div className="mb-4">
                    <InputForm
                        col={true}
                        handleOnchange={(e) => handleInputField(e, 'user_password')}
                        label="Mật khẩu"
                        name_id="user_password"
                        type="password"
                        value={inputFields.user_password}
                        invalidFields={invalidFields}
                    />
                </div>

                <div className="mb-4">
                    <div className="flex w-full items-center text-secondary text-sm">
                        <ImageCropper width={239} height={239} label="Thêm ảnh đại diện" onCropComplete={handleImageUpload} idName="user_avatar_url" />
                    </div>
                    {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
                    {inputFields.user_avatar_url && <img className="h-[200px] mt-2 rounded-sm" src={inputFields.user_avatar_url} />}
                    {invalidFields?.some((i) => i.name === 'user_avatar_url') && (
                        <div className="flex w-full justify-start text-xs text-red_custom">Vui lòng chọn hình ảnh</div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={inputFields.user_isBlocked}
                            onChange={() => setInputFields((prev) => ({ ...prev, user_isBlocked: !prev.user_isBlocked }))}
                        />
                        <span className="text-sm">Chặn người dùng</span>
                    </label>
                </div>

                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        {user ? 'Lưu thay đổi' : 'Thêm mới'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default UserModal;
