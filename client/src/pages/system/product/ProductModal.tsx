// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from 'react';
// import validate from '../../../utils/valueDate';
// import { InputForm, showNotification } from '../../../components';
// import { Modal } from '../../../components/ui/modal';
// import Button from '../../../components/ui/button/Button';
// import { countFilledFields } from '../../../utils/countFilledFields';
// import ImageCropper from '../../../components/ImageCropper';
// import { apiUploadImage } from '../../../services/uploadPicture.service';
// import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
// import DateComponent from '../../../components/DateFilterComponent';
// import { IProduct } from '../../../interfaces/product.interfaces';

// interface VoucherModalProps {
//     isOpen: boolean;
//     closeModal: () => void;
//     onSave: (data: IProduct | any) => void;
//     product?: IProduct | null;
// }

// const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, closeModal, onSave, product }) => {
//     const [inputFields, setInputFields] = useState<Partial<IProduct>>({});
//     const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);
//     const [isUploading, setIsUploading] = useState(false);

//     useEffect(() => {
//         if (product) {
//             setInputFields(product);
//         } else {
//             setInputFields((prev) => ({ ...prev, product_type: 'system', product_method: 'fixed' }));
//         }
//     }, [product]);
//     const handleSave = () => {
//         // const { _id, ...data } = inputFields;
//         // // Cập nhật giá trị mặc định khi cần thiết
//         // const updatedFields: Partial<IProduct> = {
//         //     ...data,
//         // };
//         // // Cập nhật state một lần duy nhất
//         // setInputFields(updatedFields);
//         // // Kiểm tra validation
//         // if (!validate(updatedFields, setInvalidFields)) {
//         //     showNotification('Vui lòng nhập đầy đủ thông tin', false);
//         //     return;
//         // }
//         // // Gọi hàm `onSave`
//         // onSave(product ? { _id: product._id, ...updatedFields } : updatedFields);
//     };

//     const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
//         setInputFields((prev: any) => ({ ...prev, [type]: type == 'product_is_active' ? e.target.checked : e.target.value }));
//         setInvalidFields((prev) => prev.filter((field) => field.name !== type));
//     };
//     const handleImageUpload = async (image: string, type: string): Promise<void> => {
//         setIsUploading(true);
//         const formData: any = new FormData();
//         formData.append('file', image);
//         formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
//         const response = await apiUploadImage(formData);
//         setInputFields((prev) => ({ ...prev, [type]: response.url }));
//         setInvalidFields((prev) => prev.filter((field) => field.name !== type));
//         setIsUploading(false);
//     };
//     const handleDate = (value: string, type: string) => {
//         setInputFields((prev: any) => {
//             const newFields = { ...prev, [type]: value };
//             if (type === 'product_start_date' && newFields.product_end_date && new Date(value) > new Date(newFields.product_end_date)) {
//                 showNotification('Ngày bắt đầu không thể lớn hơn ngày kết thúc!', false);
//                 return prev;
//             }
//             if (type === 'product_end_date' && newFields.product_start_date && new Date(value) < new Date(newFields.product_start_date)) {
//                 showNotification('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!', false);
//                 return prev;
//             }
//             return newFields;
//         });

//         setInvalidFields((prev) => prev.filter((field) => field.name !== type));
//     };

//     const isFormValid = countFilledFields(inputFields) >= 9;
//     return (
//         <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
//             <div className="custom-scrollbar relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900">
//                 <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{product ? 'Chỉnh sửa product' : 'Thêm product'}</h4>
//                 <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  border-gray-200 rounded-md">
//                     <div className="flex gap-4 my-2">
//                         <div className="w-1/2">
//                             <DateComponent label="Ngày bắt đầu" onChange={handleDate} value={inputFields?.product_start_date} type="product_start_date" />
//                         </div>
//                         <div className="w-1/2">
//                             <DateComponent label="Ngày kết thúc" onChange={handleDate} value={inputFields?.product_end_date} type="product_end_date" />
//                         </div>
//                     </div>
//                     <div className="mb-4">
//                         <InputForm
//                             col
//                             handleOnchange={(e) => handleInputField(e, 'product_name')}
//                             label="Tên product"
//                             name_id="product_name"
//                             value={inputFields?.product_name}
//                             invalidFields={invalidFields}
//                         />
//                         <InputForm
//                             col
//                             handleOnchange={(e) => handleInputField(e, 'product_description')}
//                             label="Mô tả"
//                             name_id="product_description"
//                             value={inputFields?.}
//                             invalidFields={invalidFields}
//                         />
//                     </div>
//                     <FormControl>
//                         <FormLabel sx={{ fontSize: '13px' }}>Hình thức giảm giá</FormLabel>
//                         <RadioGroup
//                             row
//                             name="row-radio-buttons-group"
//                             value={inputFields.product_method || 'fixed'}
//                             onChange={(e) => handleInputField(e, 'product_method')}>
//                             <FormControlLabel value="fixed" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Số tiền cố định</Typography>} />
//                             <FormControlLabel value="percent" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Phần trăm</Typography>} />
//                         </RadioGroup>
//                     </FormControl>
//                     <div className="flex gap-4 mb-4 w-full">
//                         <div className=" w-1/2">
//                             <InputForm
//                                 col
//                                 handleOnchange={(e) => handleInputField(e, 'product_value')}
//                                 label={`Giá trị giảm giá (${inputFields?.product_method === 'percent' ? '%' : 'VND'})`}
//                                 name_id="product_value"
//                                 value={inputFields?.product_value}
//                                 invalidFields={invalidFields}
//                                 type="number"
//                             />
//                         </div>
//                         {inputFields?.product_method === 'percent' && (
//                             <div className=" w-1/2">
//                                 <InputForm
//                                     col
//                                     handleOnchange={(e) => handleInputField(e, 'product_max_price')}
//                                     label="Mức giảm tối đa (VND)"
//                                     name_id="product_max_price"
//                                     value={inputFields?.product_max_price}
//                                     invalidFields={invalidFields}
//                                     type="number"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                     <FormControl>
//                         <FormLabel sx={{ fontSize: '13px' }}>Loại product</FormLabel>
//                         <RadioGroup
//                             row
//                             name="row-radio-buttons-group"
//                             value={inputFields.product_type || 'system'}
//                             onChange={(e) => handleInputField(e, 'product_type')}>
//                             <FormControlLabel value="system" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Hệ thống</Typography>} />
//                             <FormControlLabel value="user" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Đổi điểm</Typography>} />
//                         </RadioGroup>
//                     </FormControl>
//                     {inputFields.product_type === 'user' && (
//                         <div className="mb-4 w-1/2">
//                             <InputForm
//                                 col
//                                 handleOnchange={(e) => handleInputField(e, 'product_required_points')}
//                                 label="Số điểm quy đổi"
//                                 name_id="product_required_points"
//                                 value={inputFields?.product_required_points}
//                                 invalidFields={invalidFields}
//                                 type="number"
//                             />
//                         </div>
//                     )}
//                     <div className="flex gap-4 mb-4 w-full">
//                         <div className=" w-1/2">
//                             <InputForm
//                                 col
//                                 handleOnchange={(e) => handleInputField(e, 'product_max_uses')}
//                                 label="Số lần sử dụng"
//                                 name_id="product_max_uses"
//                                 value={inputFields?.product_max_uses}
//                                 invalidFields={invalidFields}
//                                 type="number"
//                             />
//                         </div>
//                         <div className=" w-1/2">
//                             <InputForm
//                                 col
//                                 handleOnchange={(e) => handleInputField(e, 'product_min_order_value')}
//                                 label="Giá trị đơn hàng tối thiểu (VND)"
//                                 name_id="product_min_order_value"
//                                 value={inputFields?.product_min_order_value}
//                                 invalidFields={invalidFields}
//                                 type="number"
//                             />
//                         </div>
//                     </div>

//                     <div className="flex w-full gap-2">
//                         <div className="w-1/2">
//                             <ImageCropper width={128} height={128} label="Thêm hình ảnh" idName="product_thumb" onCropComplete={handleImageUpload} />
//                             {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
//                             {inputFields.product_thumb && <img className="h-[200px] mt-2 rounded-sm" src={inputFields.product_thumb} alt="Brand Thumbnail" />}
//                             {invalidFields.some((i) => i.name === 'product_thumb') && <p className="text-xs text-red_custom">Vui lòng chọn hình ảnh</p>}
//                         </div>
//                         <div className="w-1/2">
//                             <ImageCropper width={382} height={506} label="Thêm banner" idName="product_banner_image" onCropComplete={handleImageUpload} />
//                             {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
//                             {inputFields.product_banner_image && (
//                                 <img className="h-[200px] mt-2 rounded-sm" src={inputFields.product_banner_image} alt="Brand banner" />
//                             )}
//                             {invalidFields.some((i) => i.name === 'product_banner_image') && <p className="text-xs text-red_custom">Vui lòng chọn hình ảnh</p>}
//                         </div>
//                     </div>
//                     <FormControl>
//                         <FormLabel sx={{ fontSize: '13px' }}>Trạng thái</FormLabel>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     checked={inputFields.product_is_active} // true hoặc false
//                                     onChange={(e) => handleInputField(e, 'product_is_active')}
//                                 />
//                             }
//                             label={<Typography sx={{ fontSize: '12px' }}>{inputFields.product_is_active ? 'Hiện' : 'Ẩn'}</Typography>}
//                         />
//                     </FormControl>
//                 </div>

//                 <div className="flex justify-end gap-3">
//                     <Button size="sm" variant="outline" onClick={closeModal}>
//                         Hủy
//                     </Button>
//                     {isFormValid && (
//                         <Button size="sm" onClick={handleSave}>
//                             {product ? 'Lưu thay đổi' : 'Thêm mới'}
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default VoucherModal;
