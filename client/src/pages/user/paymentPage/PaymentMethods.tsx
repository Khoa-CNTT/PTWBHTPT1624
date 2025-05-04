/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { PAYMENT_METHOD } from '../../../utils/const';

interface PaymentMethodsProps {
    totalPayment: number;
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ totalPayment, selectedMethod, onMethodChange }) => {
    useEffect(() => {
        if (totalPayment > 1000000 && selectedMethod === 'CASH') {
            onMethodChange('VNPAY');
        }
    }, [totalPayment, selectedMethod]);

    return (
        <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{PAYMENT_METHOD.title}</h2>
            <div className="p-4 rounded-md border border-gray-200">
                {PAYMENT_METHOD.method
                    .filter((method) => totalPayment <= 1000000 || method.code !== 'CASH')
                    .map((method) => (
                        <label
                            key={method.code}
                            className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded"
                            onClick={() => onMethodChange(method.code)}>
                            <input
                                type="radio"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                checked={selectedMethod === method.code}
                                onChange={() => onMethodChange(method.code)}
                            />
                            <img src={method.img} alt={method.code} className={method.code === 'VNPAY' ? 'w-20 h-auto' : 'w-8 h-8 object-contain'} />
                            <span className="text-sm text-gray-700">{method.label || method.code}</span>
                        </label>
                    ))}
            </div>
        </div>
    );
};

export default PaymentMethods;
