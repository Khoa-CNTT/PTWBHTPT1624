/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { InputForm, InputReadOnly, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import ImageCropper from '../../../components/ImageCropper';
import SelectOptions from '../../../components/selectOptions';
import { IUserProfile } from '../../../interfaces/user.interfaces';
import { getApiPublicDistrict, getApiPublicProvince, getApiPublicWards } from '../../../services/address.service';

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
        user_address: { city: '', detail: '', district: '', village: '' },
        user_mobile: '',
        user_avatar_url: '',
        user_isBlocked: false,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);
    const [provinces, setProvinces] = useState<{ code: number; name: string }[]>();
    const [districts, setDistricts] = useState<{ code: number; name: string }[]>();
    const [provinceId, setProvinceId] = useState<number>();
    const [districtId, setDistrictId] = useState<number>();
    const [wardsId, setWardsId] = useState<number>();
    const [wards, setWards] = useState<{ code: number; name: string }[]>();
    useEffect(() => {
        if (user) {
            setInputFields(user);
        }
    }, [user]);
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getApiPublicProvince();
            setProvinces(response);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        setDistrictId(undefined);
        const fetchApi = async () => {
            const response = await getApiPublicDistrict(provinceId);
            setDistricts(response.districts);
        };
        fetchApi();
    }, [provinceId]);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getApiPublicWards(districtId);
            setWards(response.wards);
        };
        fetchApi();
    }, [districtId]);

    useEffect(() => {
        if (provinceId || districtId || wardsId) {
            const province = provinces?.find((e) => e?.code === Number(provinceId));
            const district = districts?.find((e) => e?.code === Number(districtId));
            const ward = wards?.find((e) => e?.code === Number(wardsId));

            const detailAddress = [ward?.name, district?.name, province?.name].filter(Boolean).join(', ');
            setInputFields((prev) => ({
                ...prev,
                user_address: {
                    city: province?.name || '',
                    district: district?.name || '',
                    village: ward?.name || '',
                    detail: detailAddress,
                },
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId, districtId, wardsId]);

    const handleSave = () => {
        const { user_name, user_email, user_address, user_mobile, user_avatar_url, user_isBlocked, user_password } = inputFields;
        const data = { user_name, user_email, user_address, user_mobile, user_avatar_url, user_isBlocked, user_password };
        if (!user_address?.city || !user_address.district || !user_address.village) {
            showNotification('Vui lòng nhập đầy đủ địa chỉ');
            return;
        }
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
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  border-gray-200 rounded-md">
                    <div className="flex flex-col gap-1">
                        <SelectOptions
                            label="Tỉnh/Thành phố"
                            options={provinces}
                            selectId={provinces?.find((e) => e.code === provinceId)?.code}
                            setOptionId={setProvinceId}
                        />
                        <SelectOptions
                            label="Quận/Huyện"
                            options={districts}
                            selectId={districts?.find((e) => e.code === districtId)?.code}
                            setOptionId={setDistrictId}
                        />
                        <SelectOptions label="Xã/Phường" options={wards} selectId={wards?.find((e) => e.code === wardsId)?.code} setOptionId={setWardsId} />
                    </div>
                    <div className="mb-4">
                        <InputReadOnly col={true} label="Địa chỉ" value={inputFields.user_address?.detail} />
                    </div>
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
