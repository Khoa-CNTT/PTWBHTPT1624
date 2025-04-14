/* eslint-disable @typescript-eslint/no-explicit-any */
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IShipping } from '../../../interfaces/shipping.interfaces';

interface BannerListProps {
    shippings: IShipping[];
    onEdit: (shipping: IShipping) => void;
    onDelete: (id: any) => void;
}

const ShippingTable: React.FC<BannerListProps> = ({ shippings, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium  text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Tên công ty
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Số điện thoại
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                email
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Địa chỉ
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Thời gian vận chuyển
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
                        {shippings?.map((c) => (
                            <TableRow key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300">
                                    <span className=" truncate-trailing  line-clamp-2   font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {c.sc_name}
                                    </span>
                                </TableCell>
                                <TableCell
                                    className="px-5 
                   text-gray-700 text-center dark:text-gray-300">
                                    <span className=" truncate-trailing  line-clamp-2   font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {c.sc_phone}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className=" truncate-trailing  line-clamp-2     font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {c.sc_email}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center  dark:text-gray-300">
                                    <span className=" truncate-trailing  line-clamp-2  font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {c.sc_address}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center  dark:text-gray-300">
                                    <span className=" truncate-trailing  line-clamp-2  font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {c.sc_delivery_time.from} đến {c.sc_delivery_time.to} ngày
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center  dark:text-gray-300">
                                    <span className=" truncate-trailing  line-clamp-2  font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {c.sc_active ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center flex gap-3 justify-center">
                                    <button onClick={() => onEdit(c)} className="text-blue-500 hover:text-blue-700 transition">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => onDelete(c?._id)} className="text-red-500 hover:text-red-700 transition">
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

export default ShippingTable;
