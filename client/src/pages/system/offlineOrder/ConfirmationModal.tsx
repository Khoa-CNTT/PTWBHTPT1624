/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef } from 'react';
import { IProductInCart } from '../../../interfaces/product.interfaces';
import { ReceiptContent } from '../../../components/ReceiptContent';

interface ConfirmationModalProps {
    open: boolean;
    cart: IProductInCart[];
    paymentMethod: string;
    cashReceived: number | '';
    calculateSubtotal: number;
    calculateDiscountFromProducts: number;
    calculateTotal: number;
    calculateChange: number;
    appliedDiscount: number;
    handleCloseModal: () => void;
    handlePrintSuccess: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    cart,
    paymentMethod,
    cashReceived,
    calculateSubtotal,
    calculateDiscountFromProducts,
    calculateTotal,
    calculateChange,
    appliedDiscount,
    handleCloseModal,
    handlePrintSuccess,
}) => {
    const printRef = useRef<HTMLDivElement>(null);

    if (!open) return null;

    const handlePrint = () => {
        const printContent = printRef.current?.innerHTML;
        if (printContent) {
            // Mở tab mới
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                // Ghi nội dung HTML vào tab mới
                newWindow.document.write(`
                    <html>
                        <head>
                            <title>In hóa đơn</title>
                            <style>
                                @media print {
                                    .print-hidden {
                                        display: none !important;
                                    }
                                    .receipt-content {
                                        max-height: none !important;
                                        overflow-y: visible !important;
                                        border: none !important;
                                    }
                                    body {
                                        margin: 0;
                                        padding: 0;
                                        font-family: Arial, sans-serif;
                                    }
                                }
                                /* Thêm các style khác nếu cần */
                                .receipt-content {
                                    padding: 20px;
                                    font-size: 14px;
                                }
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin: 15px 0;
                                }
                                th, td {
                                    border: 1px solid #ddd;
                                    padding: 8px;
                                    text-align: left;
                                }
                                th {
                                    background-color: #f2f2f2;
                                }
                                .text-center {
                                    text-align: center;
                                }
                                .mb-4 {
                                    margin-bottom: 16px;
                                }
                                .space-y-1 > * + * {
                                    margin-top: 4px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="receipt-content">
                                ${printContent}
                            </div>
                            <script>
                                window.onload = function() {
                                    window.print();
                                    window.onafterprint = function() {
                                        // Gọi hàm handlePrintSuccess từ tab chính
                                        if (window.opener && window.opener.handlePrintSuccess) {
                                            window.opener.handlePrintSuccess();
                                        }
                                        window.close();
                                    };
                                };
                            </script>
                        </body>
                    </html>
                `);
                newWindow.document.close();
            }
        }
    };

    const handleConfirmAndPrint = () => {
        handlePrint(); // Mở tab mới và in hóa đơn
        // handlePrintSuccess sẽ được gọi từ tab mới sau khi in thành công
    };

    // Đảm bảo handlePrintSuccess có thể được truy cập từ tab mới
    (window as any).handlePrintSuccess = handlePrintSuccess;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 font-sans text-sm">
            <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg">
                <div
                    ref={printRef}
                    className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-gray-200 rounded-md">
                    <ReceiptContent
                        cart={cart}
                        paymentMethod={paymentMethod}
                        cashReceived={cashReceived}
                        calculateSubtotal={calculateSubtotal}
                        calculateDiscountFromProducts={calculateDiscountFromProducts}
                        calculateTotal={calculateTotal}
                        calculateChange={calculateChange}
                        appliedDiscount={appliedDiscount}
                    />
                </div>

                <div className="print-hidden flex justify-end gap-3 mt-4">
                    <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Hủy
                    </button>
                    <button onClick={handleConfirmAndPrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        In hóa đơn
                    </button>
                </div>
            </div>
        </div>
    );
};
