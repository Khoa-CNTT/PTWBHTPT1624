/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import { IBrand } from '../../../interfaces/brand.interfaces';
import ImageCropper from '../../../components/ImageCropper';

interface BrandModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: IBrand | any) => void;
    brand?: IBrand | null;
}

const BrandModal: React.FC<BrandModalProps> = ({ isOpen, closeModal, onSave, brand }) => {
    const [inputFields, setInputFields] = useState<Partial<IBrand>>({
        brand_banner: '',
        brand_name: '',
    });
    const [isUploading, setIsUploading] = useState(false);
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);
    useEffect(() => {
        if (brand) {
            setInputFields(brand);
        }
    }, [brand]);

    const handleSave = () => {
        const { brand_name, brand_banner } = inputFields;
        const data = { brand_name, brand_banner };
        if (!validate(data, setInvalidFields)) {
            showNotification('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (brand) {
            onSave({ _id: brand._id, ...data });
        } else {
            onSave(data);
            setInputFields({});
        }
    };
    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setInputFields((prev) => ({ ...prev, [type]: e.target.value }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };
    const handleImageUpload = async (image: string, type: string): Promise<void> => {
        try {
            setIsUploading(true);
            const formData: any = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
            const response = await apiUploadImage(formData);
            setInputFields((prev) => ({ ...prev, [type]: response.url }));
            setInvalidFields((prev) => prev.filter((field) => field.name !== type));
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{brand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu'}</h4>
                <InputForm
                    col
                    handleOnchange={(e) => handleInputField(e, 'brand_name')}
                    label="Tên thương hiệu"
                    name_id="brand_name"
                    value={inputFields.brand_name}
                    invalidFields={invalidFields}
                />
                <div className="flex">
                    <div className="w-full">
                        <ImageCropper width={900} height={270} label="Thêm banner" idName="brand_banner" onCropComplete={handleImageUpload} />
                        {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
                        {inputFields.brand_banner && <img className="h-[200px] mt-2 rounded-sm" src={inputFields.brand_banner} alt="Brand Thumbnail" />}
                        {invalidFields.some((i) => i.name === 'brand_banner') && <p className="text-xs text-red_custom">Vui lòng chọn hình ảnh</p>}
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        {brand ? 'Lưu thay đổi' : 'Thêm mới'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default BrandModal;
