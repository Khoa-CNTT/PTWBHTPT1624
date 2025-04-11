/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Typography } from '@mui/material';
import { InputForm, SelectOptions, showNotification } from '../../../components';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import ImageCropper from '../../../components/ImageCropper';
import { apiUploadImage } from '../../../services/uploadPicture.service';
import { apiGetAllBrands } from '../../../services/brand.service';
import { apiGetAllCategories } from '../../../services/category.service';
import { IProduct } from '../../../interfaces/product.interfaces';
import { IBrand } from '../../../interfaces/brand.interfaces';
import { ISupplier } from '../../../interfaces/supplier.interfaces';
import { apiGetAllSuppliers } from '../../../services/supplier.service';
import { ICategory } from '../../../interfaces/category.interfaces';
import InputEditor from '../../../components/input/InputEditor';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { CloseIcon } from '../../../icons';
import validate from '../../../utils/valueDate';
import DateComponent from '../../../components/DateFilterComponent';

interface ProductModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSave: (data: Partial<IProduct>) => void;
    product?: Partial<IProduct> | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, closeModal, onSave, product }) => {
    // State definitions
    const [inputFields, setInputFields] = useState<Partial<IProduct>>({
        product_images: [],
        product_description: '',
        product_quantity: 0,
        product_attribute: [],
        product_category_id: '',
        product_brand_id: '',
        product_supplier_id: '',
        product_discount: 0,
        product_name: '',
        product_price: 0,
        product_thumb: '',
    });
    const [isUploading, setIsUploading] = useState(false);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [selectCategory, setSelectCategory] = useState<string>('');
    const [selectBrand, setSelectBrand] = useState<string>('');
    const [selectSupplier, setSelectSupplier] = useState<string>('');
    const [invalidFields, setInvalidFields] = useState<Array<{ name: string; message: string }>>([]);

    // Fetch brands and categories on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const brandResponse = await apiGetAllBrands();
                const categoryResponse = await apiGetAllCategories();
                const supplierResponse = await apiGetAllSuppliers();
                setBrands(brandResponse.data || []);
                setCategories(categoryResponse.data || []);
                setSuppliers(supplierResponse.data || []);
            } catch (error) {
                showNotification('Lỗi khi tải dữ liệu danh mục và nhãn hàng', false);
            }
        };
        fetchData();
    }, []);

    // Set initial form values based on product prop
    useEffect(() => {
        if (product) {
            setInputFields(product);
            setSelectCategory(product.product_category_id || '');
            setSelectBrand(product.product_brand_id || '');
            setSelectSupplier(product.product_supplier_id || '');
        } else {
            const attribute = [
                { name: 'Xuất xứ thương hiệu', value: '' },
                { name: 'Hướng dẫn bảo quản', value: '' },
                { name: 'Hướng dẫn sử dụng', value: '' },
                { name: 'Sản phẩm có được bảo hành không?', value: '' },
                { name: 'Xuất xứ', value: '' },
                { name: 'Trọng lượng sản phẩm', value: '' },
                { name: 'Thành phần', value: '' },
            ];
            setSelectCategory('');
            setSelectBrand('');
            setInputFields((prev) => ({ ...prev, product_attribute: attribute }));
        }
    }, [product]);

    // Sync selectCategory and selectBrand with inputFields
    useEffect(() => {
        setInputFields((prev) => ({ ...prev, product_category_id: selectCategory }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== 'product_category_id'));
    }, [selectCategory]);

    useEffect(() => {
        setInputFields((prev) => ({ ...prev, product_brand_id: selectBrand }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== 'product_brand_id'));
    }, [selectBrand]);
    useEffect(() => {
        setInputFields((prev) => ({ ...prev, product_supplier_id: selectSupplier }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== 'product_supplier_id'));
    }, [selectSupplier]);

    const handleImageUpload = async (image: string, type: string): Promise<void> => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
        const response = await apiUploadImage(formData);
        setInputFields((prev) => ({ ...prev, [type]: response.url }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
        setIsUploading(false);
    };
    const handleImageUploadMany = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const uploadedUrls: string[] = [];
        const files = e.target.files;
        if (!files) return;
        setIsUploading(true);
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
            const response = await apiUploadImage(formData);
            uploadedUrls.push(response.url);
        }
        setInputFields((prev) => ({ ...prev, [type]: uploadedUrls }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
        setIsUploading(false);
    };
    const handleSave = () => {
        const {
            product_attribute,
            product_brand_id,
            product_category_id,
            product_description,
            product_discount,
            product_expiry_date,
            product_images,
            product_name,
            product_price,
            product_quantity,
            product_supplier_id,
            product_thumb,
        } = inputFields;
        const data = {
            product_attribute,
            product_brand_id,
            product_category_id,
            product_description,
            product_discount,
            product_expiry_date,
            product_images,
            product_name,
            product_price,
            product_quantity,
            product_supplier_id,
            product_thumb,
        };
        if (!validate(data, setInvalidFields)) {
            showNotification('Vui lòng! nhập đầy đủ thông tin');
            return;
        }
        onSave(product ? { _id: product._id, ...inputFields } : inputFields);
    };
    // Handlers
    const handleInputField = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const value = type === 'product_isPublished' ? e.target.checked : e.target.value;
        setInputFields((prev) => ({ ...prev, [type]: value }));
        setInvalidFields((prev) => prev.filter((field) => field.name !== type));
    };
    const handleInputFieldAttribute = (name: string, value: string) => {
        setInputFields((prev) => {
            const updatedAttributes = prev.product_attribute?.map((attr) => (attr.name === name ? { ...attr, value } : { ...attr, [name]: value })) || [];
            return { ...prev, product_attribute: updatedAttributes };
        });
        setInvalidFields((prev) => prev.filter((field) => field.name !== 'product_attribute'));
    };
    // Determine if the form is valid
    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
            <div className="custom-scrollbar relative w-full max-w-[800px] rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h4>
                <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-gray-200 rounded-md">
                    <div className="flex flex-col gap-4">
                        <InputForm
                            col={true}
                            handleOnchange={(e) => handleInputField(e, 'product_name')}
                            label="Tên sản phẩm"
                            name_id="product_name"
                            value={inputFields.product_name || ''}
                            invalidFields={invalidFields}
                        />
                        <div className="flex gap-4">
                            <SelectOptions
                                col={true}
                                label="Danh mục"
                                options={categories?.map((e) => ({ code: e._id, name: e.category_name }))}
                                selectId={selectCategory}
                                setOptionId={setSelectCategory}
                            />
                            <SelectOptions
                                col={true}
                                label="Nhãn hàng"
                                options={brands?.map((e) => ({ code: e._id || e, name: e.brand_name || e }))}
                                selectId={selectBrand}
                                setOptionId={setSelectBrand}
                            />
                            <SelectOptions
                                col={true}
                                label="Nhà cung cấp"
                                options={suppliers?.map((e) => ({ code: e._id || e, name: e.supplier_name || e }))}
                                selectId={selectSupplier}
                                setOptionId={setSelectSupplier}
                            />
                        </div>
                        <div className="flex gap-4">
                            <InputForm
                                type="number"
                                col={true}
                                handleOnchange={(e) => handleInputField(e, 'product_price')}
                                label="Đơn giá"
                                name_id="product_price"
                                value={inputFields.product_price || ''}
                                invalidFields={invalidFields}
                            />
                            <InputForm
                                type="number"
                                col={true}
                                handleOnchange={(e) => handleInputField(e, 'product_quantity')}
                                label="Số lượng"
                                name_id="product_quantity"
                                value={inputFields.product_quantity || ''}
                                invalidFields={invalidFields}
                            />
                            <InputForm
                                type="number"
                                col={true}
                                handleOnchange={(e) => handleInputField(e, 'product_discount')}
                                label="Giảm giá (%)"
                                name_id="product_discount"
                                value={inputFields.product_discount || ''}
                                invalidFields={invalidFields}
                            />
                        </div>

                        <div>
                            <div className="w-1/2">
                                <DateComponent
                                    label="Ngày bắt đầu"
                                    onChange={(e) => {
                                        setInputFields((prev) => ({ ...prev, product_expiry_date: e }));
                                        setInvalidFields((prev) => prev.filter((field) => field.name !== 'product_expiry_date'));
                                    }}
                                    value={inputFields?.product_expiry_date}
                                    type="product_expiry_date"
                                />
                            </div>
                        </div>
                        <div className=" gap-4">
                            <h2 className=" text-sm text-secondary text-center">Thông tin chi tiết</h2>
                            {invalidFields.some((i) => i.name === 'product_attribute') && (
                                <p className="text-xs  text-center text-red-500">{invalidFields.find((i) => i.name === 'product_attribute')?.message}</p>
                            )}
                            <div className="w-full">
                                {inputFields?.product_attribute?.map((item, i) => (
                                    <InputForm
                                        type="text"
                                        handleOnchange={(e) => handleInputFieldAttribute(item.name, e.target.value)}
                                        label={item?.name}
                                        name_id={`attribute_${i}`}
                                        value={item?.value}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className=" gap-4">
                            <InputEditor label="Mô Tả Sản Phẩm" value={inputFields.product_description || ''} setValue={setInputFields} />
                            {invalidFields.some((i) => i.name === 'product_description') && (
                                <p className="text-xs  text-center text-red-500">{invalidFields.find((i) => i.name === 'product_attribute')?.message}</p>
                            )}
                        </div>
                        <div className="flex w-full gap-2 my-2">
                            <div className="w-1/3">
                                <ImageCropper width={550} height={550} label="Ảnh thumbnail" idName="product_thumb" onCropComplete={handleImageUpload} />
                                {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
                                {inputFields.product_thumb && (
                                    <img className="h-[200px] mt-2 rounded-sm" src={inputFields.product_thumb} alt="Product Thumbnail" />
                                )}
                                {invalidFields.some((i) => i.name === 'product_thumb') && <p className="text-xs text-red-500">Vui lòng chọn hình ảnh</p>}
                            </div>
                            <div className="w-2/3">
                                <div className="flex w-full items-center text-secondary text-sm  ">
                                    <input id="comment_input" type="file" multiple hidden onChange={(e) => handleImageUploadMany(e, 'product_images')} />

                                    <label htmlFor="comment_input" className="flex w-full gap-2">
                                        Thêm hình ảnh
                                        <InsertPhotoIcon fontSize="medium" style={{ color: 'green' }} />
                                    </label>
                                </div>
                                {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
                                {inputFields.product_images && (
                                    <ul className="grid grid-cols-6 gap-2 px-4">
                                        {inputFields.product_images?.map((image, index) => (
                                            <li key={index} className="relative w-full h-[60px] border-solid border-[1px] my-2 border-bgSecondary">
                                                <img className="w-full h-full object-contain" src={image} alt={`Hình ảnh sản phẩm ${index}`} />
                                                <span
                                                    className="absolute top-0 right-1 cursor-pointer"
                                                    onClick={() =>
                                                        setInputFields((prev) => ({
                                                            ...prev,
                                                            product_images: prev.product_images?.filter((_, i) => i !== index),
                                                        }))
                                                    }>
                                                    <CloseIcon style={{ fontSize: '25px', color: '#C8C8CB' }} />
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {invalidFields.some((i) => i.name === 'product_images') && <p className="text-xs text-red-500">Vui lòng chọn hình ảnh</p>}
                            </div>
                        </div>
                        <FormControl>
                            <FormLabel sx={{ fontSize: '13px' }}>Trạng thái</FormLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!!inputFields.product_isPublished} // true hoặc false
                                        onChange={(e) => handleInputField(e, 'product_isPublished')}
                                    />
                                }
                                label={<Typography sx={{ fontSize: '12px' }}>{inputFields.product_isPublished ? 'Hiện' : 'Ẩn'}</Typography>}
                            />
                        </FormControl>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        {product ? 'Lưu thay đổi' : 'Thêm mới'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ProductModal;
