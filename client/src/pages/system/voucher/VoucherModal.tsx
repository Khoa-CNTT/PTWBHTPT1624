/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import ImageCropper from '../../../components/ImageCropper';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import DateComponent from '../../../components/DateFilterComponent';

interface VoucherModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: IVoucher | any) => void;
    voucher?: IVoucher | null;
}

const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, closeModal, onSave, voucher }) => {
    const [inputFields, setInputFields] = useState<Partial<IVoucher>>({
        voucher_banner_image: '',
        voucher_description: '',
        voucher_end_date: '',
        voucher_max_price: 0,
        voucher_max_uses: 0,
        voucher_method: 'fixed',
        voucher_min_order_value: 0,
        voucher_required_points: 0,
        voucher_name: '',
        voucher_start_date: '',
        voucher_type: 'system',
        voucher_uses_count: 0,
        voucher_value: 0,
        voucher_thumb: '',
    });
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (voucher) {
            setInputFields(voucher);
        }
    }, [voucher]);
    const handleSave = () => {
        const { _id, voucher_users_used, voucher_uses_count, voucher_required_points, voucher_max_price, ...data } = inputFields;
        
        // Cập nhật giá trị mặc định khi cần thiết
        const updatedFields: Partial<IVoucher> = {
            ...data,
            voucher_required_points: data.voucher_type === 'user' ? voucher_required_points ?? 0 : 0,
            voucher_max_price: data.voucher_method === 'percent' ? voucher_max_price ?? 0 : 0,
        };
    
        // Kiểm tra validation
        if (!validate(updatedFields, setInvalidFields)) {
            showNotification('Vui lòng nhập đầy đủ thông tin', false);
            return;
        }
    
        // Cập nhật lại state trước khi gọi hàm onSave
        setInputFields(prev => ({
            ...prev,
            ...updatedFields
        }));
    
        // Gọi hàm `onSave` với updatedFields
        onSave(voucher ? { _id: voucher._id, ...updatedFields } : updatedFields);
    };
    

    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setInputFields((prev: any) => ({ ...prev, [type]: type == 'voucher_is_active' ? e.target.checked : e.target.value }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };
    const handleImageUpload = async (image: string, type: string): Promise<void> => {
        setIsUploading(true);
        const formData: any = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
        const response = await apiUploadImage(formData);
        setInputFields((prev) => ({ ...prev, [type]: response.url }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
        setIsUploading(false);
    };
    const handleDate = (value: string, type: string) => {
        setInputFields((prev: any) => {
            const newFields = { ...prev, [type]: value };
            if (type === 'voucher_start_date' && newFields.voucher_end_date && new Date(value) > new Date(newFields.voucher_end_date)) {
                showNotification('Ngày bắt đầu không thể lớn hơn ngày kết thúc!', false);
                return prev;
            }
            if (type === 'voucher_end_date' && newFields.voucher_start_date && new Date(value) < new Date(newFields.voucher_start_date)) {
                showNotification('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!', false);
                return prev;
            }
            return newFields;
        });

        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
            <div className="custom-scrollbar relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{voucher ? 'Chỉnh sửa voucher' : 'Thêm voucher'}</h4>
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  border-gray-200 rounded-md">
                    <div className="flex gap-4 my-2">
                        <div className="w-1/2">
                            <DateComponent label="Ngày bắt đầu" onChange={handleDate} value={inputFields?.voucher_start_date} type="voucher_start_date" />
                        </div>
                        <div className="w-1/2">
                            <DateComponent label="Ngày kết thúc" onChange={handleDate} value={inputFields?.voucher_end_date} type="voucher_end_date" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'voucher_name')}
                            label="Tên voucher"
                            name_id="voucher_name"
                            value={inputFields?.voucher_name}
                            invalidFields={invalidFields}
                        />
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'voucher_description')}
                            label="Mô tả"
                            name_id="voucher_description"
                            value={inputFields?.voucher_description}
                            invalidFields={invalidFields}
                        />
                    </div>
                    <FormControl>
                        <FormLabel sx={{ fontSize: '13px' }}>Hình thức giảm giá</FormLabel>
                        <RadioGroup
                            row
                            name="row-radio-buttons-group"
                            value={inputFields.voucher_method || 'fixed'}
                            onChange={(e) => handleInputField(e, 'voucher_method')}>
                            <FormControlLabel value="fixed" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Số tiền cố định</Typography>} />
                            <FormControlLabel value="percent" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Phần trăm</Typography>} />
                        </RadioGroup>
                    </FormControl>
                    <div className="flex gap-4 mb-4 w-full">
                        <div className=" w-1/2">
                            <InputForm
                                col
                                handleOnchange={(e) => handleInputField(e, 'voucher_value')}
                                label={`Giá trị giảm giá (${inputFields?.voucher_method === 'percent' ? '%' : 'VND'})`}
                                name_id="voucher_value"
                                value={inputFields?.voucher_value}
                                invalidFields={invalidFields}
                                type="number"
                            />
                        </div>
                        {inputFields?.voucher_method === 'percent' && (
                            <div className=" w-1/2">
                                <InputForm
                                    col
                                    handleOnchange={(e) => handleInputField(e, 'voucher_max_price')}
                                    label="Mức giảm tối đa (VND)"
                                    name_id="voucher_max_price"
                                    value={inputFields?.voucher_max_price}
                                    invalidFields={invalidFields}
                                    type="number"
                                />
                            </div>
                        )}
                    </div>
                    <FormControl>
                        <FormLabel sx={{ fontSize: '13px' }}>Loại voucher</FormLabel>
                        <RadioGroup
                            row
                            name="row-radio-buttons-group"
                            value={inputFields.voucher_type || 'system'}
                            onChange={(e) => handleInputField(e, 'voucher_type')}>
                            <FormControlLabel value="system" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Hệ thống</Typography>} />
                            <FormControlLabel value="user" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Đổi điểm</Typography>} />
                        </RadioGroup>
                    </FormControl>
                    {inputFields.voucher_type === 'user' && (
                        <div className="mb-4 w-1/2">
                            <InputForm
                                col
                                handleOnchange={(e) => handleInputField(e, 'voucher_required_points')}
                                label="Số điểm quy đổi"
                                name_id="voucher_required_points"
                                value={inputFields?.voucher_required_points}
                                invalidFields={invalidFields}
                                type="number"
                            />
                        </div>
                    )}
                    <div className="flex gap-4 mb-4 w-full">
                        <div className=" w-1/2">
                            <InputForm
                                col
                                handleOnchange={(e) => handleInputField(e, 'voucher_max_uses')}
                                label="Số lần sử dụng"
                                name_id="voucher_max_uses"
                                value={inputFields?.voucher_max_uses}
                                invalidFields={invalidFields}
                                type="number"
                            />
                        </div>
                        <div className=" w-1/2">
                            <InputForm
                                col
                                handleOnchange={(e) => handleInputField(e, 'voucher_min_order_value')}
                                label="Giá trị đơn hàng tối thiểu (VND)"
                                name_id="voucher_min_order_value"
                                value={inputFields?.voucher_min_order_value}
                                invalidFields={invalidFields}
                                type="number"
                            />
                        </div>
                    </div>

                    <div className="flex w-full gap-2">
                        <div className="w-1/2">
                            <ImageCropper width={128} height={128} label="Thêm hình ảnh" idName="voucher_thumb" onCropComplete={handleImageUpload} />
                            {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
                            {inputFields.voucher_thumb && <img className="h-[200px] mt-2 rounded-sm" src={inputFields.voucher_thumb} alt="Brand Thumbnail" />}
                            {invalidFields.some((i) => i.name === 'voucher_thumb') && <p className="text-xs text-red_custom">Vui lòng chọn hình ảnh</p>}
                        </div>
                        <div className="w-1/2">
                            <ImageCropper width={382} height={506} label="Thêm banner" idName="voucher_banner_image" onCropComplete={handleImageUpload} />
                            {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
                            {inputFields.voucher_banner_image && (
                                <img className="h-[200px] mt-2 rounded-sm" src={inputFields.voucher_banner_image} alt="Brand banner" />
                            )}
                            {invalidFields.some((i) => i.name === 'voucher_banner_image') && <p className="text-xs text-red_custom">Vui lòng chọn hình ảnh</p>}
                        </div>
                    </div>
                    <FormControl>
                        <FormLabel sx={{ fontSize: '13px' }}>Trạng thái</FormLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={inputFields.voucher_is_active} // true hoặc false
                                    onChange={(e) => handleInputField(e, 'voucher_is_active')}
                                />
                            }
                            label={<Typography sx={{ fontSize: '12px' }}>{inputFields.voucher_is_active ? 'Hiện' : 'Ẩn'}</Typography>}
                        />
                    </FormControl>
                </div>

                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        {voucher ? 'Lưu thay đổi' : 'Thêm mới'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default VoucherModal;
