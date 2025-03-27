/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import { countFilledFields } from '../../../utils/countFilledFields';
import { ISupplier } from '../../../interfaces/supplier.interfaces';

interface SupplierModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: ISupplier | any) => void;
    supplier?: ISupplier | null;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, closeModal, onSave, supplier }) => {
    const [inputFields, setInputFields] = useState<Partial<ISupplier>>({});

    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);
    useEffect(() => {
        if (supplier) {
            setInputFields(supplier);
        } else {
            setInputFields({});
        }
    }, [supplier]);
    const handleSave = () => {
        const { supplier_address, supplier_description, supplier_email, supplier_name, supplier_phone } = inputFields;
        const data = { supplier_address, supplier_description, supplier_email, supplier_name, supplier_phone };
        if (!validate(data, setInvalidFields)) {
            showNotification('Vui lòng nhập đầy đủ thông tin', false);
            return;
        }
        if (supplier) {
            onSave({ _id: supplier._id, ...inputFields });
        } else {
            onSave(inputFields);
            setInputFields({});
        }
    };
    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setInputFields((prev: any) => ({ ...prev, [type]: e.target.value }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{supplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp'}</h4>

                <div className="mb-4">
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'supplier_name')}
                        label="Tên nhà cung cấp"
                        name_id="supplier_name"
                        value={inputFields?.supplier_name}
                        invalidFields={invalidFields}
                    />
                </div>
                <div className="mb-4">
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'supplier_description')}
                        label="Mô tả"
                        name_id="supplier_description"
                        value={inputFields?.supplier_description}
                        invalidFields={invalidFields}
                    />
                </div>
                <div className="mb-4">
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'supplier_phone')}
                        label="Số điện thoại"
                        name_id="supplier_phone"
                        value={inputFields?.supplier_phone}
                        type="number"
                        invalidFields={invalidFields}
                    />
                </div>
                <div className="mb-4">
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'supplier_email')}
                        label="Email"
                        name_id="supplier_email"
                        value={inputFields?.supplier_email}
                        invalidFields={invalidFields}
                    />
                </div>
                <div className="mb-4">
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'supplier_address')}
                        label="Địa chỉ"
                        name_id="supplier_address"
                        value={inputFields?.supplier_address}
                        invalidFields={invalidFields}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    {countFilledFields(inputFields) >= 5 && (
                        <Button size="sm" onClick={handleSave}>
                            {supplier ? 'Lưu thay đổi' : 'Thêm mới'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SupplierModal;
