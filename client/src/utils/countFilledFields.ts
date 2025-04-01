/* eslint-disable @typescript-eslint/no-explicit-any */
export const countFilledFields = (obj: Record<string, any>|null): number => {
    if(!obj) return 0;
    return Object.values(obj).filter(Boolean).length;
};
