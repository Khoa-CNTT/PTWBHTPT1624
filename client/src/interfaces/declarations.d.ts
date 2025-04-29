declare module 'moment/dist/locale/vi';
declare module 'moment/locale/vi';
declare module 'swiper/css';
declare module 'swiper/css/navigation';
declare module 'swiper/css/pagination';
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/react-weblineindia-qrcode-scanner.d.ts
declare module 'react-weblineindia-qrcode-scanner' {
    import { ComponentType } from 'react';
    // Định nghĩa props cơ bản mà component có thể nhận
    interface QRCodeScannerProps {
        onScan?: (data: string) => void;
        style?: React.CSSProperties;
        [key: string]: any; // Cho phép các props khác
    }

    const QRCodeScanner: ComponentType<QRCodeScannerProps>;
    export default QRCodeScanner;
}
