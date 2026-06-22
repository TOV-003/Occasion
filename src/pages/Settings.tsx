import Layout from "../Layout";
import { UseAuth } from "../context/UseAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../api/SupabaseClient";
import toast from "react-hot-toast";
import type { Profile } from "../interfaces";

export default function Settings() {
    const { user, authloading, logout, updateProfile, deleteAccount } = UseAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingBio, setEditingBio] = useState(false);
    const [bio, setBio] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authloading && !user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;

        async function fetchProfile() {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("id,bio, avatar_url, full_name")
                    .eq("id", user?.id)
                    .single();

                if (error) throw error;
                setProfile(data);
                setBio(data?.bio || "");
            } catch (err) {
                console.error(err);
                toast.error("Could not load profile");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        if (!user) throw new Error('No user logged in');
        const confirm = window.confirm('Are you sure you want to delete your account? This action is irreversible.');
        if (!confirm) return;
        try {
            await deleteAccount();
            toast.success('Account deleted successfully');
            navigate("/");
        }
        catch (err) {
            console.error(err);
            toast.error('Failed to delete account');
        }
    };

    const handleSaveBio = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const updatedProfile = await updateProfile(bio);
            setProfile(updatedProfile);
            setEditingBio(false);
            toast.success("Bio updated!");
        } catch (err) {
            console.error(err);
            toast.error("Could not update bio");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12 max-w-3xl">
                    <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-6"></div>
                    <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mb-6"></div>
                    <div className="mb-4">
                        <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
                        <div className="w-full h-10 bg-gray-200 rounded border border-gray-200 animate-pulse"></div>
                    </div>
                    <div className="mb-6">
                        <div className="block text-sm font-medium text-gray-700 mb-1">Bio</div>
                        <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
                            <div className="w-full h-24 bg-gray-200 rounded border border-gray-200 animate-pulse flex-1"></div>
                            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse ml-4"></div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-8">
                        <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12 max-w-3xl">
                <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
                <img src={profile?.avatar_url} alt="profile" className="h-32 w-32 rounded-full" />

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {user?.email}
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    {editingBio ? (
                        <div className="space-y-2">
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                                rows={4}
                                placeholder="Tell us about yourself..."
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveBio}
                                    disabled={saving}
                                    className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    onClick={() => {
                                        setBio(profile?.bio || "");
                                        setEditingBio(false);
                                    }}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
                            <p className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-200 flex-1">
                                {profile?.bio || "No bio set yet."}
                            </p>
                            <button
                                onClick={() => setEditingBio(true)}
                                className="ml-4 text-accent hover:text-accent-dark text-sm font-medium"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                    <button
                        onClick={handleLogout}
                        className="bg-accent text-white rounded-md px-6 py-2 hover:bg-accent-dark transition-colors shadow-sm cursor-pointer"
                    >
                        Logout
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white rounded-md px-6 py-2 hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </Layout>
    );
}