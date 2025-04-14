/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface InputFormProps {
    name_id: string;
    label?: string;
    value?: string | number;
    col?: boolean;
    type?: string;
    placeholder?: string;
    invalidFields?: Array<{ name: string; message: string }>;
    handleOnchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputForm: React.FC<InputFormProps> = ({ name_id, label, value, col, handleOnchange, type = 'text', placeholder, invalidFields }) => {
    return (
        <div className={`flex ${col ? 'flex-col' : ''} w-full h-auto gap-2 items-center mt-3`}>
            {label && (
                <label htmlFor={name_id} className={`flex ${!col ? 'justify-end w-1/2 ' : 'justify-start w-full'} text-sm text-secondary`}>
                    {label}
                </label>
            )}
            <div className="w-full">
                <input
                    required={type === 'email'}
                    id={name_id}
                    value={value}
                    placeholder={placeholder}
                    onChange={handleOnchange}
                    className="w-full border border-slate-300 py-1 px-2 text-[14px] rounded-sm outline-none"
                    type={type}
                    min={type === 'number' ? 0 : undefined}
                />
            </div>
            {invalidFields?.some((i) => i.name === name_id) && (
                <div className="flex w-full justify-start text-xs text-red_custom">{invalidFields?.find((i) => i.name === name_id)?.message}</div>
            )}
        </div>
    );
};

export default InputForm;
