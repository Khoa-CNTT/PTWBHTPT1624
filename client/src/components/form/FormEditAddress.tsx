/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { InputReadOnly, Overlay, showNotification } from '..';
import ButtonOutline from '../buttonOutline';
import SelectOptions from '../selectOptions';
import { IUserProfile } from '../../interfaces/user.interfaces';
import { getApiPublicDistrict, getApiPublicProvince, getApiPublicWards } from '../../services/address.service';
import { apiUpdateProfile } from '../../services/user.service';

interface FormEditAddressProps {
    payload: IUserProfile;
    setPayload?: (e: any) => void;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit?: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
const FormEditAddress: React.FC<FormEditAddressProps> = ({ payload, setPayload, setIsOpen, isEdit }) => {
    const [provinces, setProvinces] = useState<{ code: number; name: string }[]>();
    const [districts, setDistricts] = useState<{ code: number; name: string }[]>();
    const [provinceId, setProvinceId] = useState<number>();
    const [districtId, setDistrictId] = useState<number>();
    const [wardsId, setWardsId] = useState<number>();
    const [wards, setWards] = useState<{ code: number; name: string }[]>();
    const [address, setAddress] = useState<string>('');
    useEffect(() => {
        setAddress(payload.user_address?.detail || '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payload]);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getApiPublicProvince();
            setProvinces(response);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        setDistrictId(undefined);
        const fetchApi = async () => {
            const response = await getApiPublicDistrict(provinceId);
            setDistricts(response.districts);
        };
        fetchApi();
    }, [provinceId]);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getApiPublicWards(districtId);
            setWards(response.wards);
        };
        fetchApi();
    }, [districtId]);

    useEffect(() => {
        const province = provinces?.find((e) => e?.code === Number(provinceId));
        const district = districts?.find((e) => e?.code === Number(districtId));
        const ward = wards?.find((e) => e?.code === Number(wardsId));
        const detailAddress = [ward?.name, district?.name, province?.name].filter(Boolean).join(', ');
        setAddress(detailAddress);
    }, [provinceId, districtId, wardsId]);

    const handleSummit = async (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        const provinceName = provinces?.find((p) => p?.code === Number(provinceId))?.name || '';
        const districtName = districts?.find((d) => d?.code === Number(districtId))?.name || '';
        const wardName = wards?.find((w) => w?.code === Number(wardsId))?.name || '';
        const newAddress = {
            city: provinceName,
            district: districtName,
            village: wardName,
            detail: address,
        };
        if (isEdit) {
            const res = await apiUpdateProfile({ user_address: newAddress });
            showNotification(res.message, res.success);
            if (res.success && setPayload) {
                setPayload((prev: any) => ({
                    ...prev,
                    user_address: newAddress,
                }));
            }
        } else {
            if (setPayload) {
                setPayload((prev: any) => ({
                    ...prev,
                    user_address: newAddress,
                }));
            }
        }
        setIsOpen?.(false);
    };

    return (
        <Overlay
            className="z-[1000]"
            onClick={(e) => {
                e.stopPropagation();
                if (setIsOpen) setIsOpen(false);
            }}>
            <div
                className="relative  flex flex-col w-[600px] h-[400px] p-6 bg-white rounded-lg overflow-hidden"
                onClick={(e) => {
                    e.stopPropagation();
                    if (setIsOpen) setIsOpen(true);
                }}>
                <h1 className="text-xl mx-auto mb-8">Chỉnh sửa địa chỉ</h1>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <SelectOptions
                            label="Tỉnh/Thành phố"
                            options={provinces}
                            selectId={provinces?.find((e) => e.code === provinceId)?.code}
                            setOptionId={setProvinceId}
                        />
                        <SelectOptions
                            label="Quận/Huyện"
                            options={districts}
                            selectId={districts?.find((e) => e.code === districtId)?.code}
                            setOptionId={setDistrictId}
                        />
                        <SelectOptions label="Xã/Phường" options={wards} selectId={wards?.find((e) => e.code === wardsId)?.code} setOptionId={setWardsId} />
                    </div>
                    <InputReadOnly label="Địa chỉ" value={address} />
                </div>
                <ButtonOutline className="mx-auto px-6 text-white bg-primary mt-6" onClick={handleSummit}>
                    Lưu
                </ButtonOutline>
                {/* ---------- close --------- */}
                <span
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (setIsOpen) setIsOpen(false);
                    }}>
                    <CloseIcon fontSize="small" style={{ color: '#808089' }} />
                </span>
            </div>
        </Overlay>
    );
};

export default memo(FormEditAddress);
