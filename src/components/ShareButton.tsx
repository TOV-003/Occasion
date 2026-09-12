import { Share2, Check, MessageCircle } from "lucide-react";
import { useState } from "react";
interface ShareButtonProps {
    title?: string;
    text?: string;
    url?: string;
    className?: string;
    whatsappText?: string;
}
export default function ShareButton({ title = "Check out this event!", text = "I found this great event, thought you might like it.", url = window.location.href, className = "", whatsappText }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    async function handleShare() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
                return;
            }
            catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Share failed:", error);
                }
                return;
            }
        }
        async function copyLink() {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(function () {
                        return setCopied(false);
                    }, 3000);
                }
                else {
                    fallbackCopy(url);
                }
            }
            catch (error) {
                console.error("Clipboard copy failed:", error);
                fallbackCopy(url);
            }
        }
        copyLink();
    }
    function fallbackCopy(text: string) {
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
                setTimeout(function () {
                    return setCopied(false);
                }, 3000);
            }
            else {
                alert("Unable to copy link. Please copy it manually.");
            }
        }
        catch (error) {
            console.error("Fallback copy failed:", error);
            alert("Unable to copy link. Please copy it manually.");
        }
        finally {
            document.body.removeChild(textArea);
        }
    }
    return (<div className="inline-flex items-center gap-3">
        <button onClick={handleShare} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-inputaccent/30 bg-white text-gray-700 hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all duration-200 cursor-pointer ${copied ? "bg-green-500 text-white border-green-500" : ""} ${className}`}>
            {copied ? (<>
                    <Check size={18}/>
                    <span>Copied!</span>
                </>) : (<>
                    <Share2 size={18}/>
                    <span>Share</span>
                </>)}
        </button>
        {whatsappText && (<a href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:underline cursor-pointer">
            <MessageCircle size={16}/>
            WhatsApp
        </a>)}
    </div>);
}
