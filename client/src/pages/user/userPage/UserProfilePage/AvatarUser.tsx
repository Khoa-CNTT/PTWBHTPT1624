/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { IUserDetail } from '../../../../interfaces/user.interfaces';
import { apiUploadImage } from '../../../../services/uploadPicture.service';
import ReactLoading from 'react-loading';
import { noUser } from '../../../../assets';
import ImageCropper from '../../../../components/ImageCropper';

interface AvatarProps {
    setPayload: React.Dispatch<React.SetStateAction<IUserDetail>>;
    payload: IUserDetail;
}

const AvatarUser: React.FC<AvatarProps> = ({ setPayload, payload }) => {
    const [isLoadingImg, setIsLoadingImg] = useState(false);

    const handleImageUpload = async (image: string): Promise<void> => {
        setIsLoadingImg(true);
        const formData: any = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
        const res = await apiUploadImage(formData);
        setPayload((prev) => ({ ...prev, user_avatar_url: res.url }));
        // setInputFields((prev) => ({ ...prev, [type]: response.url }));
        // setInvalidFields((prev: any) => prev.filter((field: { name: string }) => field.name !== type));
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
            <ImageCropper width={239} height={239} label="Ảnh đại diện" onCropComplete={handleImageUpload} idName="user_avatar_url" />
        </div>
    );
};

export default AvatarUser;
