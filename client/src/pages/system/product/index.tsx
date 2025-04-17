import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import ProductTable from './ProductTable';
import { Pagination, showNotification } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import {
    apiCreateProduct,
    apiDeleteProduct,
    apiGetAllProductsByAdmin,
    apiUpdateProduct,
    apiGetProductsByExpiryStatus,
    apiSearchProduct,
} from '../../../services/product.service';
import { IProduct } from '../../../interfaces/product.interfaces';
import ProductModal from './ProductModal';
import TableSkeleton from '../../../components/skeleton/TableSkeleton';
import InputSearch from '../../../components/inputSearch';
import NotExit from '../../../components/common/NotExit';

export default function ProductManage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedProduct, setSelectedCategory] = useState<Partial<IProduct> | null>(null);
    const [displayTab, setDisplayTab] = useState<string>(''); // Tab hiện tại
    const [searchQuery, setSearchQuery] = useState<string>(''); // State tìm kiếm
    const { openModal, isOpen, closeModal } = useModal();
    const [loading, setLoading] = useState<boolean>(false);

    // Tab lọc sản phẩm
    const PRODUCT_TAB = [
        { tab: '', title: 'Tất cả sản phẩm' },
        { tab: 'expired', title: 'Sản phẩm hết hạn' },
        { tab: 'near-expired', title: 'Sản phẩm cận hết hạn' },
        { tab: 'low-stock', title: 'Sản phẩm sắp hết hàng' },  // Thêm tab "Sản phẩm sắp hết hàng"
    ];

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            let res;
            if (displayTab === 'expired') {
                res = await apiGetProductsByExpiryStatus('expired', { limit: 10, page: currentPage });
            } else if (displayTab === 'near-expired') {
                res = await apiGetProductsByExpiryStatus('near_expiry', { limit: 10, page: currentPage });
            } else if (displayTab === 'low-stock') {
                // Lọc sản phẩm có số lượng tồn kho dưới 50
                res = await apiGetAllProductsByAdmin({ limit: 10, page: currentPage });
                if (res?.success) {
                    const lowStockProducts = res.data.products.filter((product: IProduct) => product.product_quantity < 50);
                    setProducts(lowStockProducts);
                    setTotalPage(1); // Vì chúng ta không phân trang cho sản phẩm sắp hết hàng
                }
                setLoading(false);
                return;
            } else {
                res = await apiGetAllProductsByAdmin({ limit: 10, page: currentPage });
            }
            if (!res.success) return;
            const data = res.data;
            setProducts(data.products);
            setTotalPage(data.totalPage);
            setLoading(false);
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
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();
        setProducts((prev) => (data._id ? prev.map((item) => (item._id === data._id ? res.data : item)) : [res.data, ...prev]));
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
        if (value === '') {
            const fetchApi = async () => {
                let res;
                if (displayTab === 'expired') {
                    res = await apiGetProductsByExpiryStatus('expired', { limit: 10, page: currentPage });
                } else if (displayTab === 'near-expired') {
                    res = await apiGetProductsByExpiryStatus('near_expiry', { limit: 10, page: currentPage });
                } else if (displayTab === 'low-stock') {
                    res = await apiGetAllProductsByAdmin({ limit: 10, page: currentPage });
                    if (res?.success) {
                        const lowStockProducts = res.data.products.filter((product: IProduct) => product.product_quantity < 50);
                        setProducts(lowStockProducts);
                        setTotalPage(1);
                    }
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
        setSearchQuery('');
    };

    if (loading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý sản phẩm" />
            <PageBreadcrumb pageTitle="Sản phẩm " />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-4">
                    <InputSearch handleSearch={handleSearch} handleSearchChange={handleSearchChange} searchQuery={searchQuery} />
                    <button
                        onClick={handleAdd}
                        className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

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
                {products.length > 0 ? (
                    <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
                ) : (
                    <NotExit label="Không có sản phẩm nào" />
                )}
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>

            {isOpen && <ProductModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} product={selectedProduct} />}
        </>
    );
}
