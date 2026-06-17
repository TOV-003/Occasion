import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
    title?: string;
    text?: string;
    url?: string;
    className?: string;
}

export default function ShareButton({
    title = "Check out this event!",
    text = "I found this great event, thought you might like it.",
    url = window.location.href,
    className = ""
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
                return;
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Share failed:", error);
                }
                return;
            }
        }

        const copyLink = async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                } else {
                    fallbackCopy(url);
                }
            } catch (error) {
                console.error("Clipboard copy failed:", error);
                fallbackCopy(url);
            }
        };

        copyLink();
    };

    const fallbackCopy = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand("copy");
            if (successful) {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            } else {
                alert("Unable to copy link. Please copy it manually.");
            }
        } catch (error) {
            console.error("Fallback copy failed:", error);
            alert("Unable to copy link. Please copy it manually.");
        } finally {
            document.body.removeChild(textArea);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-inputaccent/30 bg-white text-gray-700 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 ${copied ? "bg-green-500 text-white border-green-500" : ""
                } ${className}`}
        >
            {copied ? (
                <>
                    <Check size={18} />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <Share2 size={18} />
                    <span>Share</span>
                </>
            )}
        </button>
    );
}