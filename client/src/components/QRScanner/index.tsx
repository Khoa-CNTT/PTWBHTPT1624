import { useState } from 'react';
import QrReader from 'react-weblineindia-qrcode-scanner';
import { showNotification } from '../common/showNotification';

const QRScanner = () => {
    const [qrResult, setQrResult] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

    const handleScan = (data: string | null) => {
        if (data) {
            setQrResult(data);
            setShowScanner(false);
            showNotification('Quét mã thành công', true);
        }
    };

    return (
        <div>
            <button onClick={() => setShowScanner(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                Mở Camera
            </button>

            {showScanner && (
                <div className="mt-4">
                    <select value={facingMode} onChange={(e) => setFacingMode(e.target.value as 'user' | 'environment')} className="border p-2 rounded">
                        <option value="environment">📷 Camera Sau</option>
                        <option value="user">🤳 Camera Trước</option>
                    </select>
                    <QrReader
                        onScan={handleScan}
                        onError={() => showNotification('Quét mã không thành công')}
                        facingMode={facingMode}
                        style={{ width: '100%' }}
                    />
                    <button onClick={() => setShowScanner(false)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                        Đóng Camera
                    </button>
                </div>
            )}

            {qrResult && <p className="mt-4">🔍 Kết quả: {qrResult}</p>}
        </div>
    );
};

export default QRScanner;
