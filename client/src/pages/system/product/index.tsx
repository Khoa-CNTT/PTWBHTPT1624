import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search'; // Biểu tượng tìm kiếm
import { useModal } from '../../../hooks/useModal';
import ProductTable from './ProductTable';
import { Pagination, showNotification } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { apiCreateProduct, apiDeleteProduct, apiGetAllProductsByAdmin, apiUpdateProduct, apiGetProductsByExpiryStatus, apiSearchProduct } from '../../../services/product.service';
import { IProduct } from '../../../interfaces/product.interfaces';
import ProductModal from './ProductModal';
import TableSkeleton from '../../../components/skeleton/TableSkeleton';

export default function ProductManage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedProduct, setSelectedCategory] = useState<Partial<IProduct> | null>(null);
    const [displayTab, setDisplayTab] = useState<string>(''); // Tab hiện tại
    const [searchQuery, setSearchQuery] = useState<string>(''); // State tìm kiếm
    const { openModal, isOpen, closeModal } = useModal();

    // Tab lọc sản phẩm
    const PRODUCT_TAB = [
        { tab: '', title: 'Tất cả sản phẩm' },
        { tab: 'expired', title: 'Sản phẩm hết hạn' },
        { tab: 'near-expired', title: 'Sản phẩm cận hết hạn' },
    ];

    useEffect(() => {
        const fetchApi = async () => {
            let res;
            if (displayTab === 'expired') {
                res = await apiGetProductsByExpiryStatus('expired', { limit: 10, page: currentPage });
            } else if (displayTab === 'near-expired') {
                res = await apiGetProductsByExpiryStatus('near_expiry', { limit: 10, page: currentPage });
            } else {
                res = await apiGetAllProductsByAdmin({ limit: 10, page: currentPage });
            }

            if (!res.success) return;
            const data = res.data;

            setProducts(data.products);
            setTotalPage(data.totalPage);
        };
        fetchApi();
    }, [currentPage, displayTab]);

    const handleAdd = () => {
        setSelectedCategory(null);
        openModal();
    };

    const handleEdit = (product: Partial<IProduct>) => {
        setSelectedCategory(product);
        openModal();
    };

    const handleSave = async (data: Partial<IProduct>) => {
        let res;
        if (data?._id) {
            res = await apiUpdateProduct(data?._id, data);
        } else {
            res = await apiCreateProduct(data);
        }
        if (!res?.success) {
            showNotification('Thêm không thành công', false);
            closeModal();
            return;
        }
        showNotification(data._id ? 'Cập nhật thành công!' : 'Thêm thành công!', true);
        closeModal();
        setProducts(
            (prev) =>
                data._id
                    ? prev.map((item) => (item._id === data._id ? res.data : item))
                    : [res.data, ...prev],
        );
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteProduct(id);

        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setProducts((prev) => prev.filter((item) => item._id != id));
        showNotification('Xóa thành công', true);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const handleTabChange = (tab: string) => {
        setDisplayTab(tab);
        setCurrentPage(0); // Reset lại trang khi chuyển tab
    };

    // ✅ Xử lý ô tìm kiếm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Khi ô tìm kiếm trống, gọi lại API lấy tất cả sản phẩm
        if (value === '') {
            const fetchApi = async () => {
                let res;
                if (displayTab === 'expired') {
                    res = await apiGetProductsByExpiryStatus('expired', { limit: 10, page: currentPage });
                } else if (displayTab === 'near-expired') {
                    res = await apiGetProductsByExpiryStatus('near_expiry', { limit: 10, page: currentPage });
                } else {
                    res = await apiGetAllProductsByAdmin({ limit: 10, page: currentPage });
                }

                if (res?.success) {
                    setProducts(res.data.products);
                    setTotalPage(res.data.totalPage);
                }
            };
            fetchApi();
        }
    };

    // ✅ Gửi API tìm kiếm
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            return; // Không làm gì nếu ô tìm kiếm trống
        }
        
        const res = await apiSearchProduct(searchQuery.trim());
        if (res.success) {
            setProducts(res.data.products);
            setTotalPage(res.data.totalPage);
        }
    };

    if (products.length === 0) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý sản phẩm" />
            <PageBreadcrumb pageTitle="Sản phẩm " />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                {/* Ô tìm kiếm nằm trên PRODUCT_TAB */}
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-1/3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border px-4 py-2 rounded-l-lg w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute top-0 right-0 px-3 py-2 bg-primary text-white rounded-r-lg">
                            <SearchIcon />
                        </button>
                    </div>

                    {/* Button thêm sản phẩm */}
                    <button
                        onClick={handleAdd}
                        className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

                {/* Tab lọc sản phẩm */}
                <div className="flex gap-4 mb-4">
                    {PRODUCT_TAB.map((e, idx) => (
                        <div
                            key={idx}
                            className={`flex justify-center items-center text-sm py-2 px-4 cursor-pointer rounded-full
                            ${displayTab === e.tab ? 'bg-primary text-white' : 'bg-transparent text-secondary'}`}
                            onClick={() => handleTabChange(e.tab)}>
                            {e.title}
                        </div>
                    ))}
                </div>

                {/* Danh sách sản phẩm */}
                <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>

            {/* Modal thêm sản phẩm */}
            {isOpen && <ProductModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} product={selectedProduct} />}
        </>
    );
}
