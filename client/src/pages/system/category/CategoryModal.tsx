/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { ICategory } from '../../../interfaces/category.interfaces';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import ImageCropper from '../../../components/ImageCropper';
import { useActionStore } from '../../../store/actionStore';

interface CategoryModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: ICategory | any) => void;
    category?: ICategory | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, closeModal, onSave, category }) => {
    const [inputFields, setInputFields] = useState<Partial<ICategory>>({
        category_name: '',
        category_thumb: '',
    });
    const { setIsLoading } = useActionStore();
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);
    useEffect(() => {
        if (category) {
            setInputFields(category);
        }
    }, [category]);

    const handleSave = () => {
        const { category_name, category_thumb } = inputFields;
        const data = { category_name, category_thumb };
        if (!validate(data, setInvalidFields)) {
            showNotification('Vui lòng! nhập đầy đủ thông tin');
            return;
        }
        onSave(category ? { _id: category._id, ...inputFields } : inputFields);
    };
    const handleInputField = (e: { target: { value: string } }, type: string) => {
        setInputFields((prev) => ({ ...prev, [type]: e.target.value }));
        setInvalidFields((prev: any) => prev.filter((field: { name: string }) => field.name !== type));
    };

    const handleImageUpload = async (image: string, type: string): Promise<void> => {
        try {
            setIsLoading(true);
            const formData: any = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
            const response = await apiUploadImage(formData);
            setInputFields((prev) => ({ ...prev, [type]: response.url }));
            setInvalidFields((prev: any) => prev.filter((field: { name: string }) => field.name !== type));
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</h4>
                <div className="mb-4">
                    <InputForm
                        col={true}
                        handleOnchange={(e) => handleInputField(e, 'category_name')}
                        label="Tên danh mục"
                        name_id="category_name"
                        value={inputFields.category_name}
                        invalidFields={invalidFields}
                    />
                </div>
                <div className="mb-4">
                    <div className="flex w-full items-center text-secondary text-sm  ">
                        <ImageCropper width={239} height={239} label="Thêm hình ảnh" onCropComplete={handleImageUpload} idName="category_thumb" />
                    </div>
                    {inputFields.category_thumb && <img className="h-[200px] mt-2 rounded-sm" src={inputFields.category_thumb} />}
                    {invalidFields?.some((i) => i.name === 'category_thumb') && (
                        <div className="flex w-full justify-start text-xs text-red_custom">Vui lòng chọn hình ảnh</div>
                    )}
                </div>
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        {category ? 'Lưu thay đổi' : 'Thêm mới'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CategoryModal;
