/* eslint-disable @typescript-eslint/no-explicit-any */
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IVoucher } from '../../../interfaces/voucher.interfaces';

interface VoucherListProps {
    vouchers: IVoucher[];
    onEdit: (voucher: IVoucher) => void;
    onDelete: (id: string | any) => void;
}

const VoucherTable: React.FC<VoucherListProps> = ({ vouchers, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Mã Voucher
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Tên voucher
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Banner
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Loại
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Giá trị voucher
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Ngày hết hạn
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {vouchers?.map((voucher) => (
                            <TableRow key={voucher?.voucher_code} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {voucher?.voucher_code}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {voucher?.voucher_name}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3">
                                    <div className="w-12 h-12 m-auto overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                        <img src={voucher?.voucher_banner_image} alt={voucher?.voucher_name} className="w-full h-full object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {voucher?.voucher_type === 'system' ? 'Hệ thống' : 'Đổi điểm'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {voucher?.voucher_value} {voucher?.voucher_method === 'percent' ? '%' : 'VND'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {new Date(voucher?.voucher_end_date).toLocaleDateString()}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 flex gap-3 justify-center">
                                    <button onClick={() => onEdit(voucher)} className="text-blue-500 hover:text-blue-700 transition">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => onDelete(voucher?._id)} className="text-red-500 hover:text-red-700 transition">
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

export default VoucherTable;
