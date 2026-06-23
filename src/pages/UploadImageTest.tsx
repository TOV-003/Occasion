import { useState, useRef, useEffect } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import Layout from '../Layout';
import { UseAuth } from '../context/UseAuth';
import { useNavigate } from 'react-router-dom';

export default function UploadImageTest() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { user, authloading, uploadBanner } = UseAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!authloading && !user) {
            navigate("/");
        }
    }, [user]);

    const handleFileChange = (selectedFile: File) => {
        if (!selectedFile) return;
        setError(null);
        setUploadedUrl(null);

        // Validate type
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(selectedFile.type)) {
            setError('Only JPEG, PNG, WebP, GIF are allowed.');
            return;
        }
        // Validate size (5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB.');
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) handleFileChange(selected);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) handleFileChange(dropped);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select an image first.');
            return;
        }

        setUploading(true);
        setError(null);
        setUploadedUrl(null);

        try {
            const url = await uploadBanner(file);
            setUploadedUrl(url);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed.';
            setError(message);
        } finally {
            setUploading(false);
        }
    };

    const clearSelection = () => {
        setFile(null);
        setPreview(null);
        setUploadedUrl(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Layout>
            <main className="flex flex-col items-center lg:items-start px-4 py-8 lg:px-8 lg:py-12 lg:max-w-4xl lg:mx-auto w-full">
                <div className="w-full mb-8">
                    <h1 className="text-3xl font-bold text-accent">Test Image Upload</h1>
                    <p className="text-sm font-light text-inputaccent mt-1">
                        Upload an image to the <span className="font-mono">banners</span> bucket and get the public URL.
                    </p>
                    <hr className="border-inputaccent/30 mt-4" />
                </div>

                {/* Upload area */}
                <div className="w-full max-w-md mx-auto">
                    {!preview ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
                                ? 'border-accent bg-accent/10'
                                : error
                                    ? 'border-red-400 bg-red-50'
                                    : 'border-inputaccent/50 hover:border-accent'
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleInputChange}
                                className="hidden"
                            />
                            <Upload size={32} className="mx-auto text-inputaccent" />
                            <p className="text-sm text-inputaccent mt-2">Click or drag to upload an image</p>
                            <p className="text-xs text-inputaccent/60">Max 5MB · JPEG, PNG, WebP, GIF</p>
                            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                        </div>
                    ) : (
                        <div className="relative rounded-lg overflow-hidden border border-inputaccent/20">
                            <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* Upload button */}
                    {preview && (
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex-1 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload to Supabase'
                                )}
                            </button>
                            <button
                                onClick={clearSelection}
                                className="px-4 py-2 rounded-lg border border-inputaccent text-inputaccent hover:border-accent hover:text-accent transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Result */}
                    {uploadedUrl && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-green-800">Upload successful!</p>
                                    <p className="text-xs text-green-700 break-all mt-1">
                                        <span className="font-mono">{uploadedUrl}</span>
                                    </p>
                                    <a
                                        href={uploadedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-accent hover:underline mt-2 inline-block"
                                    >
                                        Open in new tab →
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && !preview && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>
            </main>
        </Layout>
    );
}