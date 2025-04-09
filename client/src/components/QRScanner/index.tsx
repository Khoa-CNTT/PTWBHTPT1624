import { useState } from 'react';
import QrReader from 'react-weblineindia-qrcode-scanner';
import { showNotification } from '../common/showNotification';
import Overlay from '../common/Overlay';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
// Định nghĩa kiểu cho props của component
interface QRScannerProps {
    setQrResult: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ setQrResult }) => {
    const [showScanner, setShowScanner] = useState<boolean>(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

    // Hàm xử lý khi quét QR thành công
    const handleScan = (data: string | null) => {
        if (data) {
            setQrResult(data);
            setShowScanner(false);
        }
    };

    // Hàm xử lý lỗi khi quét QR
    const handleError = () => {
        showNotification('Quét mã không thành công', false);
    };

    return (
        <div>
            <button
                onClick={() => setShowScanner(true)}
                className="flex align-center bg-primary text-white  gap-2 px-4 py-2 rounded hover:opacity-85 transition-colors duration-200">
                <span> QUÉT</span> <QrCodeScannerIcon />
            </button>
            {showScanner && (
                <Overlay className="z-[1000] fixed right-0">
                    <div className="mt-4 w-max-[100px] text-center">
                        <select
                            value={facingMode}
                            onChange={(e) => setFacingMode(e.target.value as 'user' | 'environment')}
                            className="border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="environment">📷 Camera Sau</option>
                            <option value="user">🤳 Camera Trước</option>
                        </select>
                        <QrReader onScan={handleScan} onError={handleError} facingMode={facingMode} style={{ width: '50%', margin: 'auto' }} />
                        <button
                            onClick={() => setShowScanner(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200">
                            Đóng Camera
                        </button>
                    </div>
                </Overlay>
            )}
        </div>
    );
};

export default QRScanner;
