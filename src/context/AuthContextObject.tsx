import { createContext } from 'react';
import type { User, Session, AuthResponse } from '@supabase/supabase-js';
import type { Profile } from '../interfaces';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ user: User; session: Session | undefined; }>;
    logout: () => Promise<void>;
    getProfile: () => Promise<Profile>;
}

export const AuthContext = createContext<AuthContextType | null>(null);