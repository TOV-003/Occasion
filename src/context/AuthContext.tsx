import { AuthContext } from './AuthContextObject';
import { supabase } from '../api/SupabaseClient';
import type { User, AuthResponse } from '@supabase/supabase-js';
import type { Profile } from '../interfaces';
import { useEffect, useState, type ReactNode } from 'react';

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(prev => {
                if (prev?.id === session?.user?.id) return prev;
                return session?.user ?? null;
            });
        });

        return () => subscription.unsubscribe();
    }, []);

    async function login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    }

    async function logout() {
        await supabase.auth.signOut();
    }

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
        return data;
    }


    return (
        <AuthContext.Provider value={{ user, login, logout, getProfile }}>
            {children}
        </AuthContext.Provider>
    );

}