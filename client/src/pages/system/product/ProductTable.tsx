/* eslint-disable @typescript-eslint/no-explicit-any */
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IProduct } from '../../../interfaces/product.interfaces';
import { formatMoney } from '../../../utils/formatMoney';
import { QRCodeCanvas } from 'qrcode.react';
import QRCode from 'qrcode';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useRef } from 'react';
import dayjs from 'dayjs';

interface ProductListProps {
    products: IProduct[];
    onEdit: (product: IProduct) => void;
    onDelete: (id: string | any) => void;
}

const ProductTable: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
    const qrRef = useRef<HTMLCanvasElement>(null);

    const downloadQR = async (code: string, name: string) => {
        try {
            const url = await QRCode.toDataURL(code, { scale: 10, margin: 2 });
            const link = document.createElement('a');
            link.href = url;
            link.download = `${name}.png`;
            link.click();
        } catch (error) {
            console.error('Lỗi khi tạo QR Code:', error);
        }
    };

    const getExpiryColor = (expiryDate: string) => {
        const now = dayjs();
        const expiry = dayjs(expiryDate);
        const diffDays = expiry.diff(now, 'day');
        if (diffDays < 0) return 'bg-red-100 text-red-600'; // quá hạn
        if (diffDays <= 30) return 'bg-yellow-100 text-yellow-700'; // sắp hết hạn
        return 'bg-green-100 text-green-700'; // còn hạn lâu
    };

    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                QR Code
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Tên product
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Tồn kho
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Đã bán
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Đơn giá
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Giảm giá
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Hạn sử dụng
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {products?.map((product) => (
                            <TableRow key={product?._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 py-3 text-gray-700 cursor-pointer dark:text-gray-300">
                                    <div className="flex" onClick={() => downloadQR(product?.product_code, product?.product_name)}>
                                        <QRCodeCanvas value={product?.product_code} size={20} ref={qrRef} />
                                        <DownloadOutlinedIcon sx={{ color: 'green', fontSize: '20px' }} />
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 text-gray-70 dark:text-gray-300">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] w-[200px] line-clamp-2 text-theme-sm dark:text-white/90">
                                        {product?.product_name}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] line-clamp-1 text-theme-sm dark:text-white/90">
                                        {product?.product_quantity}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] line-clamp-1 text-theme-sm dark:text-white/90">
                                        {product?.product_sold}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] line-clamp-1 text-theme-sm dark:text-white/90">
                                        {formatMoney(product?.product_price)}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center">
                                    <span className="truncate-trailing text-[rgb(128,128,137)] line-clamp-1 text-theme-sm dark:text-white/90">
                                        {product?.product_discount}%
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center">
                                    {product?.product_expiry_date ? (
                                        <span className={`px-3 py-1 rounded-full text-theme-sm font-medium ${getExpiryColor(product?.product_expiry_date)}`}>
                                            {dayjs(product.product_expiry_date).format('DD/MM/YYYY')}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">Không có</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-3 flex gap-3 justify-center">
                                    <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700 transition">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => onDelete(product?._id)} className="text-red-500 hover:text-red-700 transition">
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

export default ProductTable;
