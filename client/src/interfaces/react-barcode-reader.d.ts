declare module 'react-barcode-reader' {
    import { FC } from 'react';

    interface BarcodeReaderProps {
        onScan: (data: string) => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => void;
        showViewFinder?: boolean;
        style?: React.CSSProperties;
    }

    const BarcodeReader: FC<BarcodeReaderProps>;

    export default BarcodeReader;
}
