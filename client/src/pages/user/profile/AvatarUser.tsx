/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { IUserDetail } from '../../../interfaces/user.interfaces';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { showNotification } from '../../../components';
import ReactLoading from 'react-loading';
import { noUser } from '../../../assets';

interface AvatarProps {
    setPayload: React.Dispatch<React.SetStateAction<IUserDetail>>;
    payload: IUserDetail;
}

const AvatarUser: React.FC<AvatarProps> = ({ setPayload, payload }) => {
    const [isLoadingImg, setIsLoadingImg] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setIsLoadingImg(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET);
        try {
            const res = await apiUploadImage(formData);
            setPayload((prev) => ({ ...prev, user_avatar_url: res.url }));
        } catch (err) {
            showNotification('Tải ảnh lên thất bại', false);
        }
        setIsLoadingImg(false);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 rounded-full overflow-hidden border border-gray-300">
                {isLoadingImg ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <ReactLoading type="spinningBubbles" color="#008848" />
                    </div>
                ) : (
                    <img className="w-full h-full object-cover" src={payload.user_avatar_url || noUser} alt="Avatar" />
                )}
            </div>
            <label className="cursor-pointer border px-4 py-2 rounded text-center">
                Chọn ảnh
                <input type="file" hidden onChange={handleImageUpload} />
            </label>
        </div>
    );
};

export default AvatarUser;
