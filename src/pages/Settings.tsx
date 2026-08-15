import Layout from "../Layout";
import Skeleton from "../components/Skeleton";
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
                <Skeleton variant="settings" />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">Account</p>
                            <h1 className="mt-2 text-2xl font-bold text-gray-900">Profile settings</h1>
                        </div>
                        {user && (
                            <button
                                type="button"
                                onClick={() => navigate(`/profile/${user.id}`)}
                                className="inline-flex items-center justify-center rounded-lg border border-inputaccent/30 bg-inputbg/30 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:bg-accent hover:text-white cursor-pointer"
                            >
                                View public profile
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl bg-inputbg/20 px-4 py-4">
                        <img
                            src={profile?.avatar_url}
                            alt="profile"
                            className="h-20 w-20 rounded-full object-cover ring-4 ring-white/80"
                        />
                        <div>
                            <p className="text-lg font-semibold text-gray-900">{profile?.full_name || "Your profile"}</p>
                            <p className="text-sm text-gray-600">Update your public details and preferences.</p>
                        </div>
                    </div>

                    <div className="space-y-6 pb-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                            <div className="rounded-xl border border-inputaccent/20 bg-inputbg/20 px-3 py-2.5 text-sm text-gray-800">
                                {user?.email || "No email available"}
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                {!editingBio && (
                                    <button
                                        type="button"
                                        onClick={() => setEditingBio(true)}
                                        className="text-sm font-medium text-accent transition-colors hover:text-accent-dark cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {editingBio ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full rounded-xl border border-inputaccent/30 bg-white/70 p-3 text-sm text-gray-800 shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                                        rows={4}
                                        placeholder="Tell us about yourself..."
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveBio}
                                            disabled={saving}
                                            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                        >
                                            {saving ? "Saving..." : "Save changes"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBio(profile?.bio || "");
                                                setEditingBio(false);
                                            }}
                                            className="rounded-lg border border-inputaccent/30 bg-inputbg/20 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-inputbg/40 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-inputaccent/20 bg-inputbg/20 p-3 text-sm leading-6 text-gray-700">
                                    {profile?.bio || "No bio set yet."}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-inputaccent/20 pt-6">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark shadow-sm cursor-pointer"
                        >
                            Logout
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 shadow-sm cursor-pointer"
                        >
                            Delete account
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}