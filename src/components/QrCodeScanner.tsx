import { useState, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CheckCircle, XCircle, Loader2, QrCode } from 'lucide-react';
import { supabase } from '../api/SupabaseClient';
import { toast } from 'react-hot-toast';

interface QrCodeScannerProps {
    eventId: string;
    onCheckIn: (ticket: any) => void;
    className?: string;
}

export default function QrCodeScanner({ eventId, onCheckIn, className = '' }: QrCodeScannerProps) {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const scannerRef = useRef<any>(null);

    async function handleScan(detectedCodes: any[]) {
        if (!detectedCodes || detectedCodes.length === 0) return;

        const result = detectedCodes[0]?.rawValue;
        if (!result) return;

        setError(null);
        setScannedData(result);
        setIsLoading(true);

        try {
            // Validate UUID format
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result)) {
                setError('Invalid ticket format');
                setTimeout(() => {
                    setError(null);
                    setScannedData(null);
                }, 2000);
                return;
            }

            // Check if ticket exists and belongs to this event
            const { data: ticket, error: ticketError } = await supabase
                .from('tickets')
                .select('*, profiles(*)')
                .eq('id', result)
                .eq('event_id', eventId)
                .eq('status', 'approved')
                .maybeSingle();

            if (ticketError || !ticket) {
                setError('Ticket not found or invalid');
                setTimeout(() => {
                    setError(null);
                    setScannedData(null);
                }, 2000);
                return;
            }

            if (ticket.checked_in) {
                setError('Already checked in!');
                setTimeout(() => {
                    setError(null);
                    setScannedData(null);
                }, 2000);
                return;
            }

            onCheckIn(ticket);
            toast.success(`Checked in: ${ticket.profiles?.full_name || 'Attendee'}`);

        } catch (err) {
            setError('Error checking in');
            console.error(err);
        } finally {
            setIsLoading(false);
            setScannedData(null);
        }
    }

    function handleError(err: any) {
        console.error('Scanner error:', err);
        setError('Camera error. Check permissions.');
    }

    return (
        <div className={`bg-white rounded-xl border border-inputaccent/20 p-4 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <QrCode size={18} className="text-accent" />
                <h3 className="font-semibold text-gray-900">Scan Ticket</h3>
            </div>

            <div className="relative w-full max-w-sm mx-auto">
                <Scanner
                    ref={scannerRef}
                    onScan={handleScan}
                    onError={handleError}
                    styles={{ container: { width: '100%' } }}
                />
            </div>

            {isLoading && (
                <div className="mt-4 flex items-center justify-center gap-2 text-accent">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Validating...</span>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                    <XCircle className="mx-auto mb-1 text-red-500" size={18} />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {scannedData && !error && !isLoading && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                    <CheckCircle className="mx-auto mb-1 text-green-600" size={18} />
                    <p className="text-sm text-green-700">Scanned successfully!</p>
                </div>
            )}

            <p className="mt-3 text-xs text-center text-gray-500">
                Point camera at attendee's QR code
            </p>
        </div>
    );
}
