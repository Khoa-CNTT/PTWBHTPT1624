/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { showNotification } from '../common/showNotification';
import Overlay from '../common/Overlay';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

// Định nghĩa kiểu cho props của component
interface QRScannerProps {
    setQrResult: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ setQrResult }) => {
    const [showScanner, setShowScanner] = useState<boolean>(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Hàm xử lý khi quét QR thành công
    const handleScan = (data: string | null) => {
        if (data) {
            setQrResult(data);
            setShowScanner(false);
        }
    };

    // Hàm xử lý lỗi khi quét QR
    const handleError = (err: any) => {
        showNotification('Quét mã không thành công: ' + err.message, false);
    };

    useEffect(() => {
        if (!showScanner || !videoRef.current) return;

        const video = videoRef.current;

        const startScanner = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: facingMode },
                });
                setStream(stream);
                video.srcObject = stream;
                video.play();

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                const scan = () => {
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        canvas.height = video.videoHeight;
                        canvas.width = video.videoWidth;
                        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
                        if (imageData) {
                            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                                inversionAttempts: 'dontInvert',
                            });

                            if (code) {
                                handleScan(code.data);
                                return;
                            }
                        }
                    }
                    requestAnimationFrame(scan);
                };
                scan();
            } catch (err) {
                handleError(err);
            }
        };

        startScanner();

        // Cleanup: Stop the camera stream when the scanner is closed
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }
        };
    }, [showScanner, facingMode]);

    return (
        <div>
            <button
                onClick={() => setShowScanner(true)}
                className="flex items-center bg-blue-600 text-white gap-2 px-4 py-2 rounded hover:opacity-85 transition-colors duration-200">
                <span>QUÉT</span>
                <QrCodeScannerIcon />
            </button>
            {showScanner && (
                <Overlay className="z-[1000] fixed right-0">
                    <div className="mt-4 w-full max-w-[300px] text-center">
                        <select
                            value={facingMode}
                            onChange={(e) => setFacingMode(e.target.value as 'user' | 'environment')}
                            className="border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                            <option value="environment">📷 Camera Sau</option>
                            <option value="user">🤳 Camera Trước</option>
                        </select>
                        <video ref={videoRef} className="w-full max-w-[300px] h-auto mx-auto rounded-lg shadow-md" />
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
