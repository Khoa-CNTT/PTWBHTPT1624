import React from 'react';
import { ButtonOutline } from '../../../components';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { IProductInCart } from '../../../interfaces/product.interfaces';

interface CartTabsProps {
    carts: IProductInCart[][];
    currentTab: number;
    setCurrentTab: (tab: number) => void;
    handleAddInvoice: () => void;
    handleDeleteInvoice: (tabIndex: number) => void;
}

export const CartTabs: React.FC<CartTabsProps> = ({ carts, currentTab, setCurrentTab, handleAddInvoice, handleDeleteInvoice }) => (
    <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-3">
            {carts.map((_, index) => (
                <div key={index} className="relative group">
                    <button
                        onClick={() => setCurrentTab(index)}
                        className={`rounded-lg px-2 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                            currentTab === index ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                        }`}>
                        Hóa Đơn {index + 1}
                    </button>
                    {currentTab !== index && (
                        <button
                            onClick={() => handleDeleteInvoice(index)}
                            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                            <DeleteIcon sx={{ fontSize: 16 }} />
                        </button>
                    )}
                </div>
            ))}
        </div>
        {carts.length < 5 && (
            <ButtonOutline onClick={handleAddInvoice}>
                <AddIcon /> Thêm Hóa Đơn
            </ButtonOutline>
        )}
    </div>
);
