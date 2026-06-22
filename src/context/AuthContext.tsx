import { AuthContext } from './AuthContextObject';
import { supabase } from '../api/SupabaseClient';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../interfaces';
import { useEffect, useState, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authloading, setAuthLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(prev => {
                if (prev?.id === session?.user?.id) return prev;
                return session?.user ?? null;
            });
            setAuthLoading(false);
        });
        getProfile().catch(console.error);

        return () => subscription.unsubscribe();
    }, [user]);

    async function login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) toast.error("Invalid email or password");
        if (error) throw error;
        return data;
    }

    async function loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        })
        if (error) throw error
    }

    async function logout() {
        await supabase.auth.signOut();
        setProfile(null);
    }

    const deleteAccount = async (): Promise<void> => {
        if (!user) throw new Error('No user logged in');

        const { data, error } = await supabase.functions.invoke('delete-user', {
            body: { user_id: user.id, permanent: true }
        });

        if (error) throw error;
        if (error) console.log(error);
        if (!data?.success) throw new Error('Failed to delete account');
        if (data?.success) toast.success("Account deleted successfully");
        if (data?.success) setProfile(null);
        await logout();
    };

    async function getProfile(): Promise<Profile> {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('Not authenticated');
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        if (error) throw error;
        setProfile(data);
        return data;
    }

    const updateProfile = async (bio: string): Promise<Profile> => {
        const { data, error } = await supabase
            .from('profiles')
            .update({ bio })
            .eq('id', user?.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    };


    return (
        <AuthContext.Provider value={{ user, authloading, login, loginWithGoogle, logout, getProfile, profile, updateProfile, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );

}