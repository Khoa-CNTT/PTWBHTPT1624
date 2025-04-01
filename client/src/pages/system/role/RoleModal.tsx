/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import validate from '../../../utils/valueDate';
import { IRole } from '../../../interfaces/role.interfaces';
import { InputForm, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import { countFilledFields } from '../../../utils/countFilledFields';
import { Checkbox, FormControl, FormControlLabel, Typography } from '@mui/material';
import PERMISSIONS from '../../../config/permissions';

interface RoleModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: IRole | any) => void;
    role?: IRole | null;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, closeModal, onSave, role }) => {
    const [inputFields, setInputFields] = useState<Partial<IRole>>({});
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);

    useEffect(() => {
        if (role) {
            setInputFields(role);
        } else {
            setInputFields({ role_name: '', role_permissions: [] });
        }
    }, [role]);

    const handleSave = () => {
        const { role_name, role_permissions } = inputFields;
        const data = { role_name, role_permissions };
        if (!validate(data, setInvalidFields)) {
            showNotification('Vui lòng! nhập đầy đủ thông tin');
            return;
        }
        if (role) {
            onSave({ _id: role?._id, ...data });
        } else {
            onSave(data);
            setInputFields({ role_name: '', role_permissions: [] });
        }
    };

    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const { checked, value } = e.target;
        if (type === 'permission') {
            setInputFields((prev) => {
                const updatedPermissions = prev.role_permissions ? [...prev.role_permissions] : [];
                if (checked) {
                    updatedPermissions.push(value);
                } else {
                    const index = updatedPermissions.indexOf(value);
                    if (index > -1) {
                        updatedPermissions.splice(index, 1);
                    }
                }
                return { ...prev, role_permissions: updatedPermissions };
            });
        } else {
            setInputFields((prev) => ({ ...prev, [type]: value }));
        }

        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };
    console.log(inputFields);
    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{role ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}</h4>
                <div className="mb-4">
                    <InputForm
                        col={true}
                        handleOnchange={(e) => handleInputField(e, 'role_name')}
                        label="Tên vai trò"
                        name_id="role_name"
                        value={inputFields.role_name}
                        invalidFields={invalidFields}
                    />
                </div>
                <div className="mb-4 mt-4">
                    <h2 className="text-sm text-secondary">Danh sách các quyền</h2>
                    <div className="max-h-[300px] overflow-y-auto px-2 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-gray-200 rounded-md">
                        <FormControl sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            {PERMISSIONS?.map((p) => (
                                <FormControlLabel
                                    key={p.key}
                                    control={
                                        <Checkbox
                                            value={p.value}
                                            checked={inputFields.role_permissions?.includes(p.value) || false}
                                            onChange={(e) => handleInputField(e, 'permission')}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: '12px' }}>{p.name}</Typography>}
                                />
                            ))}
                        </FormControl>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    {countFilledFields(inputFields) >= 2 && (
                        <Button size="sm" onClick={handleSave}>
                            {role ? 'Lưu thay đổi' : 'Thêm mới'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default RoleModal;
