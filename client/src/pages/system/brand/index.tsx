import { useEffect, useState } from "react";
import {  apiDeleteCategory } from "../../../services/category.service";
import AddIcon from '@mui/icons-material/Add';
import { useModal } from "../../../hooks/useModal";
import { apiCreateBrand, apiGetAllBrands, apiUpdateBrand } from "../../../services/brand.service";
import BrandTable from "./BrandTable";
import { IBrand } from "../../../interfaces/brand.interfaces";
import BrandModal from "./BrandModal";
import { Pagination, showNotification } from "../../../components";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function BrandManage() {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [selectedBrand, setSelectedCategory] = useState<IBrand | null>(null);

  const { openModal, isOpen, closeModal } = useModal();

  useEffect(() => {
    const fetchApi = async () => {
      const res = await apiGetAllBrands({ limit: 5, page: currentPage });
      console.log(res)
      if (!res.success) return;
      const data = res.data;
      setBrands(data.brands);
      setTotalPage(data.totalPage);
    };
    fetchApi();
  }, [currentPage]);
  const handleAdd = () => {
    setSelectedCategory(null);
    openModal(); 
  };
  const handleEdit = (brand: IBrand) => {
    setSelectedCategory(brand);
    openModal();
  };
  const handleSave = async (data: IBrand) => {
    let res;
    if (data._id) {
      res = await apiUpdateBrand(data._id, data);
    } else {
      res = await apiCreateBrand(data);
    }
    if (!res?.success) {
      showNotification(res?.message, false);
      return;
    }
    showNotification(data._id ? "Cập nhật thành công!" : "Thêm thành công!", true);
    closeModal();
    // Cập nhật danh sách thương hiệu mà không cần reload trang
    setBrands((prev) =>
      data._id
        ? prev.map((item) => (item._id === data._id ? res.data : item)) // Cập nhật thương hiệu đã có
        : [res.data,...prev ] // Thêm thương hiệu mới
    );
  };
  const handleDelete = async(id:string)=>{
    if(!id) return
    if(!confirm("Bạn có muốn xóa không?"))return
    const res = await apiDeleteCategory(id);
    console.log(res)
    if (!res?.success) {
      showNotification(res?.message, false);
      return;
    }
    setBrands((prev) =>  prev.filter((item) => (item._id !=id))   );
    showNotification("Xóa thành công", true);
    setTimeout(() => {
      window.location.reload();
  }, 2000); 
  }
  return (
    <>
      <PageMeta title="Quản lý thương hiệu" />
      <PageBreadcrumb pageTitle="TThương hiệu" />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <AddIcon />
            Thêm
          </button>
        </div>
        <BrandTable brands={brands} onEdit={handleEdit} onDelete={handleDelete} />
        {totalPage > 0 && (
          <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />
        )}
      </div>
      <BrandModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} brand={selectedBrand} />
    </>
  );
}
