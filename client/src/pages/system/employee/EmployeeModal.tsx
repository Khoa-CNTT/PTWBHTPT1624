/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { InputForm, InputReadOnly, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import ImageCropper from '../../../components/ImageCropper';
import { countFilledFields } from '../../../utils/countFilledFields';
import { IAdmin } from '../../../interfaces/admin.interfaces';
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    Radio,
    RadioGroup,
    Typography,
    SelectChangeEvent,
    OutlinedInput,
    ListItemText,
    Checkbox,
    MenuItem,
    Select,
} from '@mui/material';
import { apiGetAllRoles } from '../../../services/role.service';
import { IRole } from '../../../interfaces/role.interfaces';

interface EmployeeModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: IAdmin | any) => void;
    employee?: IAdmin | any;
}
const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, closeModal, onSave, employee }) => {
    const [inputFields, setInputFields] = useState<Partial<IAdmin>>({});
    const [isUploading, setIsUploading] = useState(false);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);
    useEffect(() => {
        setInputFields(employee ? employee : {});
    }, [employee]);
    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetAllRoles(null);
            if (res.success) {
                setRoles(res.data);
            }
        };
        fetchApi();
    }, []);
    const handleSave = () => {
        const { _id, admin_isBlocked, ...data } = inputFields;
        if (!validate(data, setInvalidFields)) {
            showNotification('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        onSave(employee ? { _id: employee._id, ...data } : data);
    };
    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setInputFields((prev) => ({
            ...prev,
            [type]: e.target.value,
            ...(type !== 'admin' ? { admin_roles: [] } : {}), // Chỉ thêm admin_roles nếu type !== 'admin'
        }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };

    const handleImageUpload = async (image: string, type: string): Promise<void> => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
        const response = await apiUploadImage(formData);
        setInputFields((prev) => ({ ...prev, [type]: response.url }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
        setIsUploading(false);
    };

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const selectedRoleNames = event.target.value as string[];
        // Tìm role_id từ role_name
        const selectedRoleIds = roles.filter((role) => selectedRoleNames.includes(role.role_name)).map((role) => role._id);
        setInputFields((prev) => ({
            ...prev,
            admin_roles: selectedRoleIds,
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl  font-semibold text-gray-800 dark:text-white">{employee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}</h4>
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  border-gray-200 rounded-md">
                    {employee ? (
                        <InputReadOnly col label="Email" value={inputFields?.admin_email} />
                    ) : (
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'admin_email')}
                            label="Email"
                            name_id="admin_email"
                            value={inputFields?.admin_email}
                            invalidFields={invalidFields}
                        />
                    )}
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'admin_name')}
                        label="Tên nhân viên"
                        name_id="admin_name"
                        value={inputFields?.admin_name}
                        invalidFields={invalidFields}
                    />
                    <InputForm
                        col
                        handleOnchange={(e) => handleInputField(e, 'admin_mobile')}
                        label="Số điện thoại"
                        name_id="admin_mobile"
                        value={inputFields?.admin_mobile}
                        invalidFields={invalidFields}
                    />
                    {!employee && (
                        <InputForm
                            col
                            handleOnchange={(e) => handleInputField(e, 'admin_password')}
                            label="Mật khẩu"
                            name_id="admin_password"
                            value={inputFields?.admin_password}
                            invalidFields={invalidFields}
                        />
                    )}
                    <FormControl sx={{ marginY: '10px' }}>
                        <FormLabel sx={{ fontSize: '13px' }}>Loại tài khoản</FormLabel>
                        <RadioGroup row value={inputFields?.admin_type || 'admin'} onChange={(e) => handleInputField(e, 'admin_type')}>
                            <FormControlLabel value="admin" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Quản trị viên</Typography>} />
                            <FormControlLabel value="employee" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Nhân viên</Typography>} />
                        </RadioGroup>
                    </FormControl>
                    {inputFields?.admin_type == 'employee' && (
                        <FormControl sx={{ width: ' 100%' }}>
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                                multiple
                                value={roles.filter((role) => inputFields?.admin_roles.includes(role._id)).map((role) => role.role_name)}
                                onChange={handleChange}
                                input={<OutlinedInput label="Vai trò" />}
                                renderValue={(selected) => selected.join(', ')}>
                                {roles?.map((r) => (
                                    <MenuItem key={r._id} value={r.role_name}>
                                        <Checkbox checked={inputFields?.admin_roles.includes(r._id)} />
                                        <ListItemText primary={r.role_name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <ImageCropper width={200} height={200} label="Thêm nhân viên" idName="admin_avatar_url" onCropComplete={handleImageUpload} />
                    {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
                    {inputFields?.admin_avatar_url && <img className="my-2  w-1/2 rounded-sm" src={inputFields?.admin_avatar_url} alt="" />}
                    {invalidFields.some((i) => i.name === 'banner_imageUrl') && <p className="text-xs text-red_custom">Vui lòng chọn hình ảnh</p>}
                </div>
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    {countFilledFields(inputFields) >= 5 && (
                        <Button size="sm" onClick={handleSave}>
                            {employee ? 'Lưu thay đổi' : 'Thêm mới'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default EmployeeModal;
