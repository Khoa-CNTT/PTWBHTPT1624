/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import ImageCropper from '../../../components/ImageCropper';
import { IBanner } from '../../../interfaces/banner.interfaces';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import DateComponent from '../../../components/DateFilterComponent';
import { useActionStore } from '../../../store/actionStore';

interface BannerModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: IBanner | any) => void;
    banner?: IBanner | null;
}

const BannerModal: React.FC<BannerModalProps> = ({ isOpen, closeModal, onSave, banner }) => {
    const [inputFields, setInputFields] = useState<Partial<IBanner>>({
        banner_description: '',
        banner_endDate: 0,
        banner_imageUrl: '',
        banner_link: '',
        banner_startDate: '',
        banner_title: '',
    });
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);
    const { setIsLoading } = useActionStore();
    useEffect(() => {
        if (banner) {
            setInputFields(banner);
        }
    }, [banner]);

    const handleSave = () => {
        const { banner_description, banner_endDate, banner_imageUrl, banner_link, banner_startDate, banner_title } = inputFields;
        const data = { banner_description, banner_endDate, banner_imageUrl, banner_link, banner_startDate, banner_title };
        if (!validate(data, setInvalidFields)) {
            showNotification('Vui lòng nhập đầy đủ thông tin', false);
            return;
        }
        if (banner) {
            onSave({ _id: banner._id, ...inputFields });
        } else {
            onSave(inputFields);
            setInputFields({});
        }
    };

    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setInputFields((prev: any) => ({ ...prev, [type]: e.target.value }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };

    const handleImageUpload = async (image: string, type: string): Promise<void> => {
        try {
            setIsLoading(true);
            const formData: any = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
            const response = await apiUploadImage(formData);
            setInputFields((prev: any) => ({ ...prev, [type]: response.url }));
            setInvalidFields((prev) => prev.filter((field) => field.name !== type));
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDate = (value: string, type: string) => {
        setInputFields((prev: any) => {
            const newFields = { ...prev, [type]: value };
            if (type === 'banner_startDate' && newFields.banner_endDate && new Date(value) > new Date(newFields.banner_endDate)) {
                showNotification('Ngày bắt đầu không thể lớn hơn ngày kết thúc!', false);
                return prev;
            }
            if (type === 'banner_endDate' && newFields.banner_startDate && new Date(value) < new Date(newFields.banner_startDate)) {
                showNotification('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!', false);
                return prev;
            }
            return newFields;
        });

        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{banner ? 'Chỉnh sửa banner' : 'Thêm banner'}</h4>
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  border-gray-200 rounded-md">
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'banner_title')}
                        label="Tên banner"
                        name_id="banner_title"
                        value={inputFields?.banner_title}
                        invalidFields={invalidFields}
                    />
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'banner_description')}
                        label="Mô tả"
                        name_id="banner_description"
                        value={inputFields?.banner_description}
                        invalidFields={invalidFields}
                    />

                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'banner_link')}
                        label="Liên kết"
                        name_id="banner_link"
                        value={inputFields?.banner_link}
                        invalidFields={invalidFields}
                    />

                    <div className="flex gap-4 my-4">
                        <div className="w-1/2">
                            <DateComponent label="Ngày bắt đầu" onChange={handleDate} value={inputFields?.banner_startDate} type="banner_startDate" />
                        </div>
                        <div className="w-1/2">
                            <DateComponent label="Ngày kết thúc" onChange={handleDate} value={inputFields?.banner_endDate} type="banner_endDate" />
                        </div>
                    </div>

                    <div className="w-full">
                        <ImageCropper width={1080} height={360} label="Thêm hình ảnh" idName="banner_imageUrl" onCropComplete={handleImageUpload} />
                        {inputFields?.banner_imageUrl && <img className="my-2 w-full rounded-sm" src={inputFields.banner_imageUrl} alt="" />}
                        {invalidFields.some((i) => i.name === 'banner_imageUrl') && <p className="text-xs text-red_custom">Vui lòng chọn hình ảnh</p>}
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        {banner ? 'Lưu thay đổi' : 'Thêm mới'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default BannerModal;
