import { Plus, Square, CheckSquare, Upload, X } from "lucide-react";
import Layout from '../Layout';
import { useState, useEffect, useRef } from 'react';
import { UseAuth } from '../context/UseAuth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { EventFormData } from '../interfaces';
import cities from '../assets/cities_12k.json';
import CityCombobox from '../components/CityCombobox';

export default function NewEvent() {
    const [unlimitedAttendees, setUnlimitedAttendees] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const { user, authloading, createEvent, uploadBanner } = UseAuth();
    const navigate = useNavigate();
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [bannerError, setBannerError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        category: '',
        description: '',
        city: '',
        location: '',
        event_dates: [],
        max_attendees: null,
        auto_approve: true,
        banner_url: '',
    });

    useEffect(() => {
        if (!authloading && !user) {
            toast.error("Please login to create an event.");
            navigate("/");
        }
    }, [user]);

    useEffect(() => {
        console.log(formData);
    }, [formData])

    useEffect(() => {
        if (bannerFile) {
            console.log(URL.createObjectURL(bannerFile))
        }
    }, [bannerFile])

    const changeCategory = (category: string) => {
        setFormData({ ...formData, category });
    };

    const addDate = () => {
        if (selectedDate && !formData.event_dates.includes(selectedDate)) {
            setFormData(prev => ({
                ...prev,
                event_dates: [...prev.event_dates, selectedDate].sort()
            }));
            setSelectedDate('');
        }
    };

    const removeDate = (date: string) => {
        setFormData(prev => ({
            ...prev,
            event_dates: prev.event_dates.filter(d => d !== date)
        }));
    };

    const formatDate = (date: string) => {
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const validateImage = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                const aspectRatio = img.width / img.height;
                if (aspectRatio >= 0.9 && aspectRatio <= 1.1) {
                    resolve(true);
                } else {
                    setBannerError('Image must be roughly square (aspect ratio between 0.9:1 and 1.1:1)');
                    resolve(false);
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                setBannerError('Failed to load image. Please try again.');
                resolve(false);
            };
            img.src = url;
        });
    };

    const handleImageChange = async (file: File) => {
        setBannerError(null);

        // Validate type & size first
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
            setBannerError('Only JPEG, PNG, WebP, GIF images are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setBannerError('Image must be smaller than 5MB.');
            return;
        }

        const isValid = await validateImage(file);
        if (!isValid) return;

        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageChange(file);
    };

    const removeImage = () => {
        setBannerFile(null);
        setBannerPreview(null);
        setBannerError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        

        if (!formData.title) {
            toast.error("Event title is required.");
            return;
        }
        if (!formData.category) {
            toast.error("Category is required.");
            return;
        }
        if (!formData.description) {
            toast.error("Description is required.");
            return;
        }
        if (!formData.city) {
            toast.error("City is required.");
            return;
        }
        if (!formData.location) {
            toast.error("Location is required.");
            return;
        }
        if (formData.event_dates.length === 0) {
            toast.error("At least one event date is required.");
            return;
        }
        if (!bannerFile) {
            toast.error("Please upload a banner image.");
            return;
        }

        toast.success("All fields validated!");

        const uploadToast = toast.loading("Uploading banner image...");
        let uploadedUrl: string;
        try {
            uploadedUrl = await uploadBanner(bannerFile);
            toast.success("Banner uploaded successfully!", { id: uploadToast });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed.", { id: uploadToast });
            return;
        }

        const createToast = toast.loading("Creating event...");
        try {
            const payload = {
                ...formData,
                banner_url: uploadedUrl,
                max_attendees: formData.max_attendees,
            };

            const event = await createEvent(payload);
            toast.success("Event created successfully!", { id: createToast });
            navigate(`/event/${event.id}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create event.", { id: createToast });
        }
    };



    const categories = [
        'Nightlife', 'Festival', 'Arts', 'Sports', 'Food',
        'Business', 'Education', 'Social', 'Family', 'Wellness', 'Workshop'
    ];

    return (
        <Layout>
            <main className="flex flex-col items-center lg:items-start px-4 py-8 lg:px-8 lg:py-12 lg:max-w-4xl lg:mx-auto w-full">
                <div className="w-full mb-8">
                    <h1 className="text-3xl font-bold text-accent">Create a New Event</h1>
                    <p className="text-sm font-light text-inputaccent mt-1">
                        Fill in the details below to list your event on Occasion.
                    </p>
                    <hr className="border-inputaccent/30 mt-4" />
                </div>

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="eventTitle"
                            placeholder="e.g. Jazz Night at The Loft"
                            className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={formData.category !== cat ? "px-3 py-1 rounded-full border border-inputaccent text-inputaccent text-sm font-light hover:border-accent hover:text-accent transition-colors" : "px-3 py-1 rounded-full border border-inputaccent bg-accent text-white text-sm font-light transition-colors"}
                                    onClick={() => changeCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-inputaccent mt-1">Select one category that best fits your event.</p>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            placeholder="Describe your event – what, when, why, and who it's for…"
                            className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Venue / Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="location"
                                placeholder="e.g. The Jazz Loft"
                                className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <CityCombobox
                                cities={cities}
                                onSelect={(city) => setFormData({ ...formData, city })}
                                placeholder="Search cities..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Dates <span className="text-red-500">*</span>
                        </label>

                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={addDate}
                                disabled={!selectedDate}
                                className={`flex items-center gap-1 text-sm transition-colors ${selectedDate ? 'text-accent hover:underline' : 'text-inputaccent/50 cursor-not-allowed'
                                    }`}
                            >
                                <Plus size={16} /> Add date
                            </button>
                        </div>

                        {formData.event_dates.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.event_dates.map((date) => (
                                    <span
                                        key={date}
                                        className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                                    >
                                        {formatDate(date)}
                                        <button
                                            type="button"
                                            onClick={() => removeDate(date)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            x
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-inputaccent mt-1">
                            Add individual dates for your event. They will be automatically sorted.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Attendees
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative">
                                <input
                                    type="number"
                                    disabled={unlimitedAttendees}
                                    placeholder="e.g. 100"
                                    className={`w-40 bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${unlimitedAttendees ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    value={formData.max_attendees ?? ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        max_attendees: e.target.value === '' ? null : Number(e.target.value)
                                    })}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setUnlimitedAttendees(!unlimitedAttendees); setFormData({
                                        ...formData,
                                        max_attendees: null
                                    })
                                }}
                                className="flex items-center gap-2 text-sm text-inputaccent hover:text-accent transition-colors"
                            >
                                {unlimitedAttendees ? (
                                    <CheckSquare size={18} className="text-accent" />
                                ) : (
                                    <Square size={18} />
                                )}
                                Unlimited
                            </button>
                        </div>
                        <p className="text-xs text-inputaccent mt-1">Leave blank or toggle Unlimited for no capacity limit.</p>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, auto_approve: !formData.auto_approve })}
                            className="flex items-center gap-2 text-sm text-inputaccent hover:text-accent transition-colors"
                        >
                            {!formData.auto_approve ? (
                                <CheckSquare size={18} className="text-accent" />
                            ) : (
                                <Square size={18} />
                            )}
                            Require manual approval for ticket purchases
                        </button>
                        <p className="text-xs text-inputaccent mt-1">If checked, each ticket request must be manually approved by you.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Banner Image <span className="text-red-500">*</span>
                        </label>

                        {!bannerPreview ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
                                    ? 'border-accent bg-accent/10'
                                    : bannerError
                                        ? 'border-red-400 bg-red-50'
                                        : 'border-inputaccent/50 hover:border-accent'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                                <Upload size={32} className="mx-auto text-inputaccent" />
                                <p className="text-sm text-inputaccent mt-2">Click or drag to upload a banner image</p>
                                <p className="text-xs text-inputaccent/60">Recommended: Square image, max 5MB</p>
                                {bannerError && (
                                    <p className="text-sm text-red-500 mt-2">{bannerError}</p>
                                )}
                            </div>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-inputaccent/20">
                                <img
                                    src={bannerPreview}
                                    alt="Banner preview"
                                    className="w-full aspect-square object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-inputaccent/20">
                        <button
                            type="submit"
                            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition-colors font-medium"
                        >
                            Create Event
                        </button>
                        <button
                            type="button"
                            className="border border-inputaccent text-inputaccent px-6 py-2 rounded-lg hover:border-accent hover:text-accent transition-colors"
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </Layout>
    );
}