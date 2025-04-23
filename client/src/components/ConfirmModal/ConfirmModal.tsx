// ConfirmModal.tsx
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {/* Header với độ mờ */}
        <h2 className="text-xl font-semibold text-center mb-4 opacity-80">Xác nhận xóa</h2>
        <p className="text-gray-700 text-center mb-6">{message}</p>
        
        {/* Các nút bấm */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="w-1/3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="w-1/3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
