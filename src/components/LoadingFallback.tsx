export default function LoadingFallback() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading events...</p>
            </div>
        </div>
    );
}