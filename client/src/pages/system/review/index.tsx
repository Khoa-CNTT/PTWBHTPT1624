import { useEffect, useState } from 'react';
import { showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import ReviewTable from './ReviewTable';
import { IReview } from '../../../interfaces/review.interfaces';
import { apiApproveReview, apiDeleteReview, apiGetAdminReviews } from '../../../services/review.service';
import NotExit from '../../../components/common/NotExit';
import Pagination from '../../../components/pagination';

export default function ReviewManage() {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<'all' | 'pending' | 'approved'>('all');

    const REVIEW_TAB = [
        { tab: 'all', title: 'Tất cả đánh giá' },
        { tab: 'pending', title: 'Đánh giá đợi duyệt' },
        { tab: 'approved', title: 'Đánh giá đã duyệt' },
    ];

    const fetchReviews = async () => {
        setLoading(true);
        const res = await apiGetAdminReviews(tab, {
            limit: 20,
            page: currentPage,
        });
        if (res.success && res.data) {
            setReviews(res.data.Reviews || []);
            setTotalPage(res.data.totalPage || 0);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [tab, currentPage]);

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa đánh giá này không?')) return;
        const res = await apiDeleteReview(id);
        if (!res?.success) return showNotification(res?.message, false);
        setReviews((prev) => prev.filter((item) => item._id !== id));
        showNotification('Xóa thành công', true);
    };

    const handleApprove = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn duyệt đánh giá này không?')) return;
        const res = await apiApproveReview(id);
        if (!res?.success) return showNotification(res?.message, false);
        setReviews((prev) => prev.map((item) => (item._id === id ? { ...item, isApproved: true } : item)));
        showNotification('Duyệt thành công', true);
    };

    if (loading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý đánh giá" />
            <PageBreadcrumb pageTitle="Đánh giá" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                {/* Tabs */}
                <div className="mb-4 flex space-x-4">
                    {REVIEW_TAB.map((item) => (
                        <button
                            key={item.tab}
                            onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                setTab(item.tab as any);
                                setCurrentPage(0); // reset page
                            }}
                            className={`py-2 px-4 rounded-lg text-sm font-medium ${
                                tab === item.tab ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}>
                            {item.title}
                        </button>
                    ))}
                </div>

                {/* Danh sách đánh giá */}
                {reviews.length > 0 ? (
                    <ReviewTable Reviews={reviews} onDelete={handleDelete} onApprove={handleApprove} />
                ) : (
                    <NotExit label="Không có đánh giá nào" />
                )}
                <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />
            </div>
        </>
    );
}
