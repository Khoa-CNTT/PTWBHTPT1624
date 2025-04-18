import React, { memo } from 'react';
interface SelectAddressProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectId: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOptionId: (e: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any;
    col?: boolean;
    label: string;
}

// eslint-disable-next-line react-refresh/only-export-components
const SelectOptions: React.FC<SelectAddressProps> = ({ selectId, setOptionId, options, label, col }) => {
    return (
        <div className={`flex ${col ? 'flex-col' : ''} w-full h-auto gap-3 items-center`}>
            <label className={`flex ${!col ? 'justify-end  w-2/6' : 'justify-start w-full'} text-sm text-secondary`}>{label}</label>
            <select
                value={selectId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setOptionId(e.target.value);
                }}
                className={`flex ${
                    !col ? 'w-4/6' : 'w-full'
                } border-solid border-[1px] text-[14px] text-center border-slate-300 py-1 px-2 rounded-sm outline-none`}>
                <option key="" value="">{`--${label}--`}</option>
                {options?.map((e: { code?: string; name?: string }) => (
                    <option key={e.code} value={e.code} className="text-[14px]">
                        {e.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export default memo(SelectOptions);
