/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import { countFilledFields } from '../../../utils/countFilledFields';
import { IShipping } from '../../../interfaces/shipping.interfaces';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Typography } from '@mui/material';

interface ShippingModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: IShipping | any) => void;
    shipping?: IShipping | null;
}

const ShippingModal: React.FC<ShippingModalProps> = ({ isOpen, closeModal, onSave, shipping }) => {
    const [inputFields, setInputFields] = useState<Partial<IShipping>>({});
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);

    useEffect(() => {
        setInputFields(shipping || {});
    }, [shipping]);

    const handleSave = () => {
        const { _id, sc_delivery_time, ...data } = inputFields;
        if (sc_delivery_time?.from && sc_delivery_time?.to && Number(sc_delivery_time.from) > Number(sc_delivery_time.to)) {
            showNotification('Số ngày vận chuyển tối thiểu không được lớn hơn tối đa', false);
            return;
        }
        if (!validate({ ...sc_delivery_time, ...data }, setInvalidFields)) {
            showNotification('Vui lòng nhập đầy đủ thông tin', false);
            return;
        }

        onSave(shipping ? { _id: shipping._id, ...inputFields } : inputFields);
    };

    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, field: keyof IShipping | 'from' | 'to') => {
        const { value, checked, type } = e.target;
        setInputFields((prev: any) => {
            if (field === 'from' || field === 'to') {
                return {
                    ...prev,
                    sc_delivery_time: {
                        ...prev.sc_delivery_time,
                        [field]: value,
                    },
                };
            }
            return {
                ...prev,
                [field]: type === 'checkbox' ? checked : value,
            };
        });
        setInvalidFields((prev) => prev.filter((f) => f.name !== field));
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
            <div className="no-scrollbar relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{shipping ? 'Chỉnh sửa thông tin công ty' : 'Thêm công ty mới'}</h4>
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-gray-200 rounded-md">
                    <div className="mb-4">
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'sc_name')}
                            label="Tên công ty"
                            name_id="sc_name"
                            value={inputFields.sc_name}
                            invalidFields={invalidFields}
                        />
                    </div>
                    <div className="mb-4">
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'sc_phone')}
                            label="Số điện thoại"
                            name_id="sc_phone"
                            value={inputFields.sc_phone}
                            invalidFields={invalidFields}
                        />
                    </div>
                    <div className="mb-4">
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'sc_email')}
                            label="Email"
                            name_id="sc_email"
                            value={inputFields.sc_email}
                            invalidFields={invalidFields}
                        />
                    </div>
                    <div className="mb-4">
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'sc_shipping_price')}
                            label="Phí vận chuyển"
                            name_id="sc_shipping_price"
                            value={inputFields.sc_shipping_price}
                            type="number"
                            invalidFields={invalidFields}
                        />
                    </div>
                    <div className="mb-4">
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'sc_address')}
                            label="Địa chỉ"
                            name_id="sc_address"
                            value={inputFields.sc_address}
                            invalidFields={invalidFields}
                        />
                    </div>
                    <div className="mb-4">
                        <h2>Thời gian vận chuyển</h2>
                        <div className="flex gap-4">
                            <InputForm
                                col
                                handleOnchange={(e) => handleInputField(e, 'from')}
                                label="Tối thiểu (ngày)"
                                name_id="from"
                                type="number"
                                value={inputFields?.sc_delivery_time?.from}
                                invalidFields={invalidFields}
                            />
                            <InputForm
                                col
                                handleOnchange={(e) => handleInputField(e, 'to')}
                                label="Tối đa (ngày)"
                                name_id="to"
                                type="number"
                                value={inputFields?.sc_delivery_time?.to}
                                invalidFields={invalidFields}
                            />
                        </div>
                    </div>
                    <FormControl>
                        <FormLabel sx={{ fontSize: '13px' }}>Trạng thái</FormLabel>
                        <FormControlLabel
                            control={<Checkbox checked={inputFields.sc_active} onChange={(e) => handleInputField(e, 'sc_active')} />}
                            label={<Typography sx={{ fontSize: '12px' }}>{inputFields.sc_active ? 'Hoạt động' : 'Không hoạt động'}</Typography>}
                        />
                    </FormControl>
                </div>
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    {countFilledFields(inputFields) >= 6 && (
                        <Button size="sm" onClick={handleSave}>
                            {shipping ? 'Lưu thay đổi' : 'Thêm mới'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ShippingModal;
