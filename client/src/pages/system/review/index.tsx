/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import ReviewTable from './ReviewTable';
import { IReview } from '../../../interfaces/review.interfaces';
import { apiApproveReview, apiDeleteReview, apiGetAdminReviews } from '../../../services/review.service';
import NotExit from '../../../components/common/NotExit';
import Pagination from '../../../components/pagination';
import { useActionStore } from '../../../store/actionStore';
import { sendNotificationToUser } from '../../../services/notification.service';
import { INotification } from '../../../interfaces/notification.interfaces';
import useSocketStore from '../../../store/socketStore';

export default function ReviewManage() {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const { setIsLoading } = useActionStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<'all' | 'pending' | 'approved'>('all');
    const { socket, isConnected, connect } = useSocketStore();

    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);
    const REVIEW_TAB = [
        { tab: 'all', title: 'Tất cả đánh giá' },
        { tab: 'pending', title: 'Đánh giá đợi duyệt' },
        { tab: 'approved', title: 'Đánh giá đã duyệt' },
    ];

    const fetchReviews = async () => {
        setLoading(true);
        const res = await apiGetAdminReviews(tab, {
            limit: 10,
            page: currentPage,
        });
        if (res.success && res.data) {
            // Update the state to use res.data.reviews instead of res.data.Reviews
            setReviews(res.data.reviews || []);
            setTotalPage(res.data.totalPage || 0);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [tab, currentPage]);

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa đánh giá này không?')) return;
        setIsLoading(true);
        const res = await apiDeleteReview(id);
        if (!res?.success) return showNotification(res?.message, false);
        setReviews((prev) => prev.filter((item) => item._id !== id));
        setIsLoading(false);
        showNotification('Xóa thành công', true);
    };

    const handleApprove = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn duyệt đánh giá này không?')) return;
        setIsLoading(true);
        const res = await apiApproveReview(id);
        setIsLoading(false);
        if (!res?.success) return showNotification(res?.message, false);
        setReviews((prev) => prev.map((item) => (item._id === id ? { ...item, isApproved: true } : item)));
        showNotification('Bình luận đã được duyệt thành công!', true);
        const notification: INotification = {
            notification_user: res?.data?.order_user,
            notification_title: 'Bình luận đã được duyệt',
            notification_subtitle: 'Cảm ơn bạn đã góp ý! Bình luận của bạn đã được duyệt thành công.',
            notification_imageUrl:
                'data:image/jpeg;base64,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',
            notification_link: `/nguoi-dung/chi-tiet-don-hang/${id}`,
        };
        const response = await sendNotificationToUser(res?.data?.order_user, notification);
        socket.emit('sendNotificationToUser', {
            ...response.data,
        });
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
                    <>
                        <ReviewTable Reviews={reviews} onDelete={handleDelete} onApprove={handleApprove} />
                        {totalPage > 1 && <Pagination currentPage={currentPage} totalPage={totalPage - 1} setCurrentPage={setCurrentPage} />}
                    </>
                ) : (
                    <NotExit label="Không có đánh giá nào" />
                )}
            </div>
        </>
    );
}
