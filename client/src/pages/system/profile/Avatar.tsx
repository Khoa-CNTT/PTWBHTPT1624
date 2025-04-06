/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { IAdmin } from '../../../interfaces/admin.interfaces';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { showNotification } from '../../../components';
import ReactLoading from 'react-loading';
import { noUser } from '../../../assets';

interface AvatarProps {
    setPayload: React.Dispatch<React.SetStateAction<IAdmin>>;
    payload: IAdmin;
}
const Avatar: React.FC<AvatarProps> = ({ setPayload, payload }) => {
    const [isLoadingImg, setIsLoadingImg] = useState<boolean>(false);
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setIsLoadingImg(true);
        if (!files) return;
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET);
        try {
            const response = await apiUploadImage(formData);
            setPayload((e: any) => ({ ...e, admin_avatar_url: response.url }));
        } catch (error) {
            showNotification('Lỗi xảy ra khi tải lên ảnh:', false);
        }
        setIsLoadingImg(false);
    };

    return (
        <div className="flex flex-col w-full items-center gap-4 ">
            <div className="w-48 h-48 rounded-full overflow-hidden mx-auto  border-[1px] border-solid border-separate">
                {isLoadingImg ? (
                    <div className="w-full flex justify-center h-full items-center">
                        <ReactLoading type="cylon" color="rgb(0, 136, 72)" />
                    </div>
                ) : (
                    <img className="w-full h-full object-cover block" src={payload.admin_avatar_url || noUser} />
                )}
            </div>
            <label className=" border-[1px] border-solid border-separate py-2 px-4">
                Chọn ảnh
                <input type="file" readOnly hidden onChange={handleImageUpload} className="none" />
            </label>
        </div>
    );
};

export default Avatar;
