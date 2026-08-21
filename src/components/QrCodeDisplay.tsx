import { QRCodeCanvas } from 'qrcode.react';
import { useState, useRef } from 'react';
import { Download, Eye, EyeOff } from 'lucide-react';

interface QrCodeDisplayProps {
    ticketId: string;
    className?: string;
}

export default function QrCodeDisplay({ ticketId, className = '' }: QrCodeDisplayProps) {
    const [showQr, setShowQr] = useState(true);
    const qrRef = useRef<HTMLDivElement>(null);

    function downloadQrCode() {
        const canvas = qrRef.current?.querySelector('canvas') as HTMLCanvasElement;
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `ticket-${ticketId}.png`;
            link.click();
        }
    }

    return (
        <div className={`bg-white rounded-xl border border-inputaccent/20 p-4 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Your Ticket QR Code</h4>
                <div className="flex gap-1">
                    <button
                        onClick={() => setShowQr(!showQr)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                        title={showQr ? 'Hide' : 'Show'}
                    >
                        {showQr ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                        onClick={downloadQrCode}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                        title="Download"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {showQr ? (
                <div ref={qrRef} className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                    <QRCodeCanvas
                        value={ticketId}
                        size={180}
                        bgColor="#FFFFFF"
                        fgColor="#1F2937"
                        level="H"
                    />
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">
                    QR Code Hidden
                </div>
            )}

            <p className="text-xs text-center text-gray-500 mt-3">
                Show this at the event entrance
            </p>
        </div>
    );
}
