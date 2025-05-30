/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import { IBrand } from '../../../interfaces/brand.interfaces';
import ImageCropper from '../../../components/ImageCropper';
import { useActionStore } from '../../../store/actionStore';

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
    const { setIsLoading } = useActionStore();
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
        }
    };

    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setInputFields((prev) => ({ ...prev, [type]: e.target.value }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };
    const handleImageUpload = async (image: string, type: string): Promise<void> => {
        try {
            setIsLoading(true);
            const formData: any = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
            const response = await apiUploadImage(formData);
            setInputFields((prev) => ({ ...prev, [type]: response.url }));
            setInvalidFields((prev) => prev.filter((field) => field.name !== type));
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
        } finally {
            setIsLoading(false);
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
                <div className="flex my-2">
                    <div className="w-full">
                        <ImageCropper width={1080} height={360} label="Thêm banner" idName="brand_banner" onCropComplete={handleImageUpload} />
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
