/* eslint-disable @typescript-eslint/no-explicit-any */
export const countFilledFields = (obj: Record<string, any>): number => {
    return Object.values(obj).filter(Boolean).length;
};
