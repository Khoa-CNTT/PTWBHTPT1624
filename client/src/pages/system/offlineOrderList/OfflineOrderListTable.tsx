/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IOrder } from '../../../interfaces/order.interfaces';
import { formatMoney } from '../../../utils/formatMoney';
import { ViewOrder } from './ViewOrder';
import { useModal } from '../../../hooks/useModal';
interface OrderListProps {
    offlineOrder: IOrder[];
}
const OfflineOrderTable: React.FC<OrderListProps> = ({ offlineOrder }) => {
    const [order, setOrder] = useState<IOrder>();
    const { isOpen, closeModal, openModal } = useModal();

    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                                STT
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                                Mã đơn hàng
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium w-[300px]  text-gray-500 text-center text-sm dark:text-gray-400">
                                Tên hàng/Số lượng
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center text-gray-500 text-sm dark:text-gray-400">
                                Tổng tiên
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium min-w-[110px] text-center text-gray-500 text-sm dark:text-gray-400">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {offlineOrder?.map((order, index) => (
                            <TableRow key={order?._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 text-gray-70 dark:text-gray-300">
                                    <span className=" truncate-trailing text-[rgb(128,128,137)] line-clamp-2  text-theme-sm dark:text-white/90">
                                        {index + 1}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3">
                                    <span className=" truncate-trailing text-[rgb(128,128,137)]  line-clamp-1  text-theme-sm dark:text-white/90">
                                        #{order?.order_code}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 dark:text-gray-300">
                                    <div className="truncate-trailing text-[rgb(128,128,137)] line-clamp-3  text-theme-sm dark:text-white/90 space-y-1">
                                        {order.order_products?.map((p: any) => (
                                            <p key={p._id}>
                                                {p.productId?.product_name} <span className="text-red-500">x{p.quantity}</span>
                                            </p>
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell className="px-5 py-3 text-center dark:text-gray-300">
                                    <span className=" truncate-trailing text-[rgb(128,128,137)] line-clamp-1  text-theme-sm dark:text-white/90">
                                        {formatMoney(order?.order_total_price - order?.order_total_apply_discount)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <button
                                        className="text-[13px] text-primary underline cursor-pointer"
                                        onClick={() => {
                                            setOrder(order);
                                            openModal();
                                        }}>
                                        Xem hóa đơn
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {order && <ViewOrder order={order} closeModal={closeModal} isOpen={isOpen} />}
        </div>
    );
};

export default OfflineOrderTable;
