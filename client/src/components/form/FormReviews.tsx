/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { v4 as uuidv4 } from 'uuid';
import { ButtonOutline, Overlay, showNotification } from '..';
import { RATING_REVIEW } from '../../utils/const';
import { Review } from '../../interfaces/dashboard.interface';
import { IProductItem } from '../../interfaces/product.interfaces';
import { IReviews } from '../../interfaces/reviews.interfaces';
import useUserStore from '../../store/userStore';
import useAuthStore from '../../store/authStore';
import usePurchasedStore from '../../store/purchasedStore';
import { apiUploadImage } from '../../services/uploadPicture.service';
import { useActionStore } from '../../store/actionStore';
import { apiCreateReview, apiUpdateReview } from '../../services/review.service';

interface FormReviewsProps {
    setReviews?: React.Dispatch<React.SetStateAction<Review[]>>;
    reviews?: IReviews[];
    reviewEdit?: IReviews;
    productReview: IProductItem | any;
    setOpenFormReview?: React.Dispatch<React.SetStateAction<boolean>>;
    // setRatings?: React.Dispatch<React.SetStateAction<{ _id: string; rating: number }[]>>;
    title: string;
    isEdit?: boolean;
    isReview?: boolean;
    titleButton?: string;
    // socketRef: React.MutableRefObject<SocketIOClient.Socket | null>;
}

const FormReviews: React.FC<FormReviewsProps> = ({
    setReviews,
    reviews,
    isEdit,
    productReview,
    reviewEdit,
    isReview = false,
    setOpenFormReview,
    titleButton = 'Gửi đánh giá',
    title,
    // setRatings,
    // socketRef,
}) => {
    const [isLoad, setIsLoad] = useState(false);
    const [valueInput, setValueInput] = useState('');
    const [imagesUrl, setImagesUrl] = useState<string[]>([]);
    const [rating, setRating] = useState(5);
    const { user, addRewardPoints } = useUserStore();
    const { isUserLoggedIn } = useAuthStore();
    const { setIsLoading, setOpenFeatureAuth } = useActionStore();
    const { purchasedProducts, setIsReviewedPurchasedProduct } = usePurchasedStore();
    useEffect(() => {
        if (isEdit && reviewEdit) {
            setImagesUrl(reviewEdit.review_images);
            setValueInput(reviewEdit.review_comment);
            setRating(reviewEdit.review_rating);
        }
        if (!purchasedProducts.some((pc) => pc.pc_productId._id === productReview._id)) {
            setRating(0);
        }
    }, [isEdit, reviewEdit, productReview, purchasedProducts, user._id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setIsLoad(true);
        const formData = new FormData();
        for (const file of files) {
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET);
            try {
                const response = await apiUploadImage(formData);
                setImagesUrl((prev) => [...prev, response.url]);
            } catch {
                showNotification('Lỗi xảy ra khi tải lên ảnh.', false);
            }
        }

        setIsLoad(false);
    };

    const postComment = async () => {
        setIsLoading(true);
        const res = await apiCreateReview({ review_comment: valueInput, review_images: imagesUrl, review_rating: rating, review_productId: productReview._id });
        showNotification(res.message, res.success);
        if (!res.success) {
            setIsLoading(false);
            return;
        }
        setIsReviewedPurchasedProduct(productReview._id);
        addRewardPoints();
        // const notification: INotification = {
        //     image_url: productReview.image_url,
        //     shopId: productReview.user?._id || '',
        //     title: productReview.title,
        //     user_name: formatUserName(user),
        //     subtitle: 'đã đánh giá sản phẩm của bạn',
        //     link: location.pathname,
        // };

        // const response = await apiCreateNotification(notification);
        // response.success && socketRef.current?.emit('sendNotification', response.data);
        if (!isReview) {
            setReviews?.((prev) => [{ ...res.data, user: user }, ...prev]);
            // setRatings?.((prev) => [...prev, { _id: res._id, rating }]);
        }
        setOpenFormReview?.(false);
        setIsLoading(false);
    };

    const editComment = async () => {
        const res = await apiUpdateReview(reviewEdit!._id, {
            review_comment: valueInput,
            review_images: imagesUrl,
            review_rating: rating,
            review_productId: productReview._id,
        });

        if (!res.success) {
            showNotification('Cập nhật không thành công!', true);
            return;
        }
        if (reviews) {
            const updatedReviews = reviews.filter((r) => r._id !== reviewEdit!._id);
            if (!isReview) {
                setReviews?.(() => [{ ...res.data, rating, user: user }, ...updatedReviews]);
                // setRatings?.((prev) => [...prev, { _id: res._id, rating }]);
            }
        }
        setOpenFormReview?.(false);
        showNotification('Cập nhật thành công!', true);
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isUserLoggedIn) {
            setOpenFeatureAuth(true);
            return;
        }
        if (isLoad) {
            showNotification('Đang tải ảnh, vui lòng chờ!', true);
            return;
        }
        if (!valueInput.trim()) {
            showNotification('Vui lòng nhập nhận xét!', false);
            return;
        }
        if (isEdit) {
            await editComment();
        } else {
            await postComment();
        }
    };
    return (
        <Overlay
            className="z-[1000]"
            onClick={(e) => {
                e.stopPropagation();
                setOpenFormReview?.(false);
            }}>
            <div className="flex flex-col tablet:w-full laptop:w-1/2 bg-white p-4 rounded-md gap-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between">
                    <h3 className="text-xl">{title}</h3>
                    <CloseIcon className="cursor-pointer" onClick={() => setOpenFormReview?.(false)} />
                </div>
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-gray-200 rounded-md">
                    <div className="flex justify-center items-center w-10/12 mx-auto gap-3">
                        <img className="h-20 w-20" src={productReview.product_thumb} alt="Product" />
                        <span className="text-sm">{productReview.product_name}</span>
                    </div>

                    <ul className="flex gap-2 justify-center">
                        {RATING_REVIEW.map((s) => (
                            <li
                                key={s.start}
                                className="flex flex-col items-center gap-1 text-[rgb(243,153,74)] cursor-pointer"
                                onClick={() => {
                                    if (purchasedProducts.some((pc) => pc.pc_productId._id === productReview._id)) {
                                        setRating(s.start);
                                    } else {
                                        showNotification('Bạn không được phép đánh giá');
                                    }
                                }}>
                                {s.start <= rating ? (
                                    <StarRateIcon style={{ fontSize: '40px', color: 'rgb(243,153,74)' }} />
                                ) : (
                                    <StarOutlineIcon style={{ fontSize: '40px', color: 'rgb(243,153,74)' }} />
                                )}
                                <span className={`text-xs ${s.start === rating ? 'font-bold' : 'font-medium'}`}>{s.text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col border border-gray-300 rounded-md py-1 w-10/12 mx-auto">
                        <textarea
                            placeholder="Nhận xét sản phẩm ..."
                            rows={3}
                            value={valueInput}
                            onChange={(e) => setValueInput(e.target.value)}
                            className="outline-none resize-none px-3"
                        />
                        <div className="flex justify-center border-t border-gray-300">
                            <input id="comment_input" type="file" multiple hidden onChange={handleImageUpload} />
                            <label htmlFor="comment_input">
                                <InsertPhotoIcon fontSize="large" style={{ color: 'green' }} />
                            </label>
                        </div>

                        {imagesUrl.length > 0 && (
                            <div className="w-full h-[100px] overflow-auto">
                                <ul className="grid grid-cols-6 gap-3 px-4">
                                    {imagesUrl.map((image) => (
                                        <li key={uuidv4()} className="relative w-full h-[60px] border border-bgSecondary my-4">
                                            <img src={image} className="w-full h-full object-fill" alt="review" />
                                            <CloseIcon
                                                className="absolute top-0 right-1 cursor-pointer"
                                                style={{ fontSize: '25px', color: '#C8C8CB' }}
                                                onClick={() => setImagesUrl((prev) => prev.filter((i) => i !== image))}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 items-center mt-6">
                        <ButtonOutline
                            className={`w-4/12 text-lg mx-auto bg-primary text-white ${isLoad || !valueInput ? 'opacity-60' : ''}`}
                            onClick={handleSubmit}>
                            {titleButton}
                        </ButtonOutline>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};

export default FormReviews;
