/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { IReview } from '../../../interfaces/review.interfaces';
interface ReviewListProps {
    Reviews: IReview[];
    onDelete: (id: string | any) => void;
    onApprove: (id: string | any) => void;
}

const ReviewTable: React.FC<ReviewListProps> = ({ Reviews, onDelete, onApprove }) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Tên người dùng
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Bình luận
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Hình ảnh
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Trạng thái
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {Reviews?.map((review) => (
                            <TableRow key={review?._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-2 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {review?.review_user?.user_name}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-2 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {review?.review_comment}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    {review?.review_images?.length > 0
                                        ? review?.review_images.map((i: string) => <img src={i} key={i} alt="Review image" />)
                                        : 'Không có ảnh'}
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-2 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {review?.isApproved ? 'Đã duyệt' : 'Chưa duyệt'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    {!review.isApproved && (
                                        <button onClick={() => onApprove(review?._id)} className="text-blue-500 hover:text-blue-700 transition">
                                            <DoneIcon />
                                        </button>
                                    )}
                                    <button onClick={() => onDelete(review?._id)} className="text-red-500 hover:text-red-700 transition">
                                        <DeleteIcon />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ReviewTable;
