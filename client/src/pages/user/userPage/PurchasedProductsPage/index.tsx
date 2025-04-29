import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/ui/table';
import { IProductItem } from '../../../../interfaces/product.interfaces';
import { formatDate } from '../../../../utils/format/formatDate';
import { NotFound } from '../../../../components';
import PaidIcon from '@mui/icons-material/Paid';
import usePurchasedStore from '../../../../store/purchasedStore';
import FormReviews from '../../../../components/form/FormReviews';
import { Link } from 'react-router';
const PurchasedProductsPage: React.FC = () => {
    const [openFormReview, setOpenFormReview] = useState<boolean>(false);
    const [productReview, setProductReview] = useState<IProductItem>();
    const { purchasedProducts } = usePurchasedStore();
    return (
        <div className="tablet:fixed tablet:top-0 tablet:right-0 tablet:z-[1000] w-full h-full bg-white p-6 laptop:rounded-lg overflow-y-auto">
            <div className="w-full mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Sản phẩm đã mua</h1>

                {purchasedProducts && purchasedProducts.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
                        <Table>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-4 text-sm font-medium text-gray-600">
                                        Mã SP
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-sm font-medium text-gray-600">
                                        Hình ảnh
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-sm font-medium text-gray-600">
                                        Tên sản phẩm
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-sm font-medium text-gray-600">
                                        Số lượng
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-sm font-medium text-gray-600">
                                        Ngày mua
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-4 text-sm font-medium text-gray-600 text-center">
                                        Thao tác
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {purchasedProducts.map((pc) => (
                                    <TableRow key={pc._id} className="hover:bg-gray-50 transition">
                                        <TableCell className="px-6 py-4 text-sm text-gray-700">{pc.pc_productId.product_code}</TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="w-14 h-14 rounded-md overflow-hidden shadow">
                                                <img
                                                    src={pc.pc_productId.product_thumb}
                                                    alt={pc.pc_productId.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-gray-800 max-w-[250px] line-clamp-2">
                                            <Link className="hover:underline" to={`/${pc.pc_productId.product_slug}/${pc.pc_productId._id}`}>
                                                {pc.pc_productId.product_name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-sm">
                                            <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">{pc.pc_quantity}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-gray-500">{formatDate(pc.pc_purchaseDate)}</TableCell>
                                        <TableCell className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                {pc.pc_isReviewed ? (
                                                    <span className="text-sm text-green-600 font-medium">Bạn đã đánh giá</span>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setOpenFormReview(true);
                                                                setProductReview(pc.pc_productId);
                                                            }}
                                                            className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-full shadow transition-all">
                                                            Đánh giá ngay
                                                        </button>
                                                        <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                                                            +5000 <PaidIcon fontSize="small" />
                                                        </div>
                                                        <span className="text-xs text-gray-400">Nhận 5000 sao khi đánh giá</span>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="pt-10 text-center text-gray-500">
                        <NotFound>Không có sản phẩm nào đã mua</NotFound>
                    </div>
                )}
            </div>
            {openFormReview && (
                <FormReviews
                    isReviewed={false}
                    isReview
                    title="Nhận xét"
                    titleButton="Gửi bình luận"
                    productReview={productReview}
                    setOpenFormReview={setOpenFormReview}
                    // socketRef={socketRef}
                />
            )}
        </div>
    );
};

export default PurchasedProductsPage;
