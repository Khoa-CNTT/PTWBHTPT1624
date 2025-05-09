import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import NotExit from '../../../components/common/NotExit';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IProductInCart } from '../../../interfaces/cart.interfaces';

interface CartTableProps {
    cart: IProductInCart[];
    calculateSubtotal: number;
    handleQuantityChange: (index: number, delta: number) => void;
    handleRemoveProduct: (index: number) => void;
}

export const CartTable: React.FC<CartTableProps> = ({ cart, calculateSubtotal, handleQuantityChange, handleRemoveProduct }) => (
    <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
            <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                        <TableCell isHeader className="px-2 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                            STT
                        </TableCell>
                        <TableCell isHeader className="px-2 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                            Sản Phẩm
                        </TableCell>
                        <TableCell isHeader className="px-2 py-3 w-[100px] text-gray-500 text-start text-theme-xs dark:text-gray-400">
                            Hình Ảnh
                        </TableCell>
                        <TableCell isHeader className="px-2 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                            Số Lượng
                        </TableCell>
                        <TableCell isHeader className="px-2 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                            Giá Tiền
                        </TableCell>
                        <TableCell isHeader className="px-2 py-3 w-[100px] text-gray-500 text-center text-theme-xs dark:text-gray-400">
                            Giảm Giá
                        </TableCell>
                        <TableCell isHeader className="px-2 py-3 w-[100px] text-gray-500 text-center text-theme-xs dark:text-gray-400">
                            Thao Tác
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {cart.map((item, index) => (
                        <TableRow key={item.productId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell className="px-2 py-3 text-gray-700 text-center dark:text-gray-300">{index + 1}</TableCell>
                            <TableCell className="px-2 py-3 text-gray-800 dark:text-gray-300 min-w-[200px]">
                                {item.product_name || 'Sản phẩm không tên'}
                            </TableCell>
                            <TableCell className="px-2 py-3">
                                {item.product_thumb && (
                                    <img src={item.product_thumb} alt={item.product_name} className="h-14 w-14 rounded-lg object-cover shadow-sm" />
                                )}
                            </TableCell>
                            <TableCell className="px-2 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <button
                                        onClick={() => handleQuantityChange(index, -1)}
                                        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                                        −
                                    </button>
                                    <span className="w-8 text-center text-gray-800 dark:text-gray-300">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(index, 1)}
                                        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                                        +
                                    </button>
                                </div>
                            </TableCell>
                            <TableCell className="px-2 py-3 text-gray-800 text-center dark:text-gray-300">{item.product_price}</TableCell>
                            <TableCell className="px-2 py-3 text-gray-800 text-center dark:text-gray-300">{item.product_discount}%</TableCell>
                            <TableCell className="px-2 py-3 flex gap-3 justify-center">
                                <button onClick={() => handleRemoveProduct(index)} className="text-red-500 hover:text-red-700 transition">
                                    <DeleteIcon />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        {!(calculateSubtotal > 0) && <NotExit label="Chưa có sản phẩm nào" />}
    </div>
);
