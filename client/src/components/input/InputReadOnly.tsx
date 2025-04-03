/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import EditIcon from '@mui/icons-material/Edit';

interface InputReadOnlyProps {
    label: string;
    value: string | number | any;
    col?: boolean;
    isEdit?: boolean;
    handleEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}
// eslint-disable-next-line react-refresh/only-export-components
const InputReadOnly: React.FC<InputReadOnlyProps> = ({ label, col, value, isEdit, handleEdit }) => {
    return (
        <div className={`flex ${col ? 'flex-col' : ''} w-full  h-auto gap-1 items-center mt-3`}>
            <label htmlFor="exact-address" className={`flex ${!col ? 'justify-end w-1/2' : 'justify-start w-full'} text-sm text-secondary`}>
                {label}
            </label>
            <div className="flex w-full bg-[#e9ecef] rounded-md overflow-hidden">
                <input id="exact-address" type="text" readOnly value={value} className="bg-[#e9ecef]  text-sm w-full px-3 py-1 outline-none border-none" />
                {isEdit && (
                    <div
                        className="text-sm text-blue-custom my-2 cursor-pointer"
                        onClick={() => {
                            if (handleEdit) {
                                handleEdit((isEdit) => !isEdit);
                            }
                        }}>
                        <EditIcon fontSize="small" style={{ opacity: '0.4' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(InputReadOnly);
