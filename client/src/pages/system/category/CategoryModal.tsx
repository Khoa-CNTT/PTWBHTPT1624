/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Button from "../../../components/system/ui/button/Button";
import { Modal } from "../../../components/system/ui/modal";
import { ICategory } from "../../../interfaces/category.interfaces";
import { InputForm, showNotification } from '../../../components/user';
import validate from '../../../utils/valueDate';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { apiUploadImage } from '../../../services/apiUploadPicture';
import { setIsLoading } from '../../../redux/features/action/actionSlice';
import { useAppDispatch } from '../../../redux/hooks';

interface CategoryModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSave: (data: ICategory) => void;
  category?: ICategory | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, closeModal, onSave, category }) => {
  const [inputFields, setInputFields] = useState<ICategory>({} as ICategory|any);
  const dispatch = useAppDispatch();
const [isUploading, setIsUploading] = useState(false);
  const [invalidFields, setInvalidFields] = useState< Array<{  name: string; message: string; }> >([]);
  useEffect(() => {
    if (category) {
      setInputFields(category);
    } else {
      setInputFields({category_name:'',category_thumb:''});
    }
  }, [category]);

  const handleSave = () => {
    const {  category_name,category_thumb} = inputFields;
    const data = {category_name,category_thumb}
    if (!validate(data, setInvalidFields)) {
      showNotification('Vui lòng! nhập đầy đủ thông tin');
      return;
  }
  if (category) {
    onSave({ _id: category?._id, ...data});
  } else {
    onSave(data);
    setInputFields({category_name:'',category_thumb:''});
  }
  
  };
  const handleInputField = (e: { target: { value: string } }, type: string) => {
    setInputFields((prev) => ({ ...prev, [type]: e.target.value }));
    setInvalidFields((prev: any) => prev.filter((field: { name: string }) => field.name !== type));
};

const handleImageUpload = async ( type: string,   e: React.ChangeEvent<HTMLInputElement> ): Promise<void> => {
  setIsUploading(true)
      const file = e.target.files?.[0]; // Lấy duy nhất 1 ảnh
      if (!file) return;
      dispatch(setIsLoading(true));
      const formData:any = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET as string);
        const response = await apiUploadImage(formData);
       setInputFields((prev) => ({ ...prev, [type]: response.url })); // Chỉ lưu 1 ảnh
      setInvalidFields((prev: any) => prev.filter((field: { name: string }) => field.name !== type));
      setIsUploading(false)
};

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
      <div className="no-scrollbar relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white"> 
          {category ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
        </h4>
        <div className="mb-4">
        <InputForm
        col={true}
        handleOnchange={(e) => handleInputField(e, 'category_name')}
        label="Tên danh mục"
        name_id="category_name"
        value={inputFields.category_name}
        invalidFields={invalidFields}
                        />
        </div>
        <div className="mb-4">
          <div className="flex w-full items-center text-secondary text-sm  ">
                            <input id="comment_input" type="file" multiple hidden onChange={(e)=>handleImageUpload("category_thumb",e)} />
                            <label htmlFor="comment_input" className="flex w-full gap-2">
                                Thêm hình ảnh
                                <InsertPhotoIcon fontSize="medium" style={{ color: 'green' }} />
                            </label>
                        </div>
                        {isUploading && <p className="text-sm text-gray-500">Đang tải ảnh...</p>}
                       { inputFields.category_thumb&&<img className='h-[200px]' src={inputFields.category_thumb} />}
                        {invalidFields?.some((i) => i.name ==="category_thumb") && (
                <div className="flex w-full justify-start text-xs text-red_custom">Vui lòng chọn hình ảnh</div>
            )}
        </div>
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={closeModal}>Hủy</Button>
       {  inputFields.category_thumb&&inputFields.category_name&& <Button size="sm" onClick={handleSave}>
            {category ? "Lưu thay đổi" : "Thêm mới"}
          </Button>}
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
