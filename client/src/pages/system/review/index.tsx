import { useEffect, useState } from 'react';
import { Pagination, showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import ReviewTable from './ReviewTable';
import { IReview } from '../../../interfaces/review.interfaces';
import { apiApproveReview, apiDeleteReview, getPendingReviews } from '../../../services/review.service';
import NotExit from '../../../components/common/NotExit';

export default function ReviewManage() {
    const [Reviews, setReviews] = useState<IReview[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    // Lấy danh sách người dùng từ API
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const res = await getPendingReviews({ limit: 5, page: currentPage });
            if (!res.success) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', res.message);
                return;
            }
            const data = res.data;
            // Kiểm tra dữ liệu trước khi cập nhật state
            if (data && Array.isArray(data.Reviews)) {
                setReviews(data.Reviews);
                setTotalPage(data.totalPage);
            } else {
                console.error('Dữ liệu từ API không hợp lệ');
            }
            setLoading(false);
        };
        fetchApi();
    }, [currentPage]);

    // Hàm xử lý khi checkbox thay đổi
    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteReview(id);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setReviews((prev) => prev.filter((item) => item._id != id));
        showNotification('Xóa thành công', true);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };
    const handleApprove = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn duyệt bình luận này không?')) return;
        const res = await apiApproveReview(id);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setReviews((prev) => prev.filter((item) => item._id != id));
        showNotification('Duyệt thành công', true);
    };
    if (loading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý người dùng" />
            <PageBreadcrumb pageTitle="Người dùng" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                {Reviews.length > 0 ? (
                    <ReviewTable Reviews={Reviews} onDelete={handleDelete} onApprove={handleApprove} />
                ) : (
                    <NotExit label="Không có đánh giá nào" />
                )}
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
        </>
    );
}
