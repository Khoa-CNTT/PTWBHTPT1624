/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/modal';
import { InputForm, showNotification } from '../../../components';
import Button from '../../../components/ui/button/Button';
import { IDashboard } from '../../../interfaces/dashboard.interfaces';

interface DashboardModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: IDashboard) => void;
    item?: IDashboard;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, closeModal, onSave, item }) => {
    const [inputFields, setInputFields] = useState<Partial<IDashboard>>({
        title: '',
        description: '',
    });

    useEffect(() => {
        if (item) {
            setInputFields({
                title: item.title || '',
                description: item.description || '',
            });
        }
    }, [item]);

    const handleSave = () => {
        if (!inputFields.title || !inputFields.description) {
            showNotification('Vui lòng nhập đầy đủ thông tin', false);
            return;
        }
        // Thực hiện lưu
        onSave(item ? { ...item, ...inputFields } : inputFields as IDashboard);
    };

    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setInputFields((prev) => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                    {item ? 'Chỉnh sửa mục' : 'Thêm mới'}
                </h4>
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 border border-gray-200 rounded-md">
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'title')}
                        label="Tiêu đề"
                        name_id="title"
                        value={inputFields.title}
                    />
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'description')}
                        label="Mô tả"
                        name_id="description"
                        value={inputFields.description}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>Hủy</Button>
                    <Button size="sm" onClick={handleSave}>{item ? 'Lưu thay đổi' : 'Thêm mới'}</Button>
                </div>
            </div>
        </Modal>
    );
};

export default DashboardModal;
