import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, Event, EventFormData, Collective } from '../interfaces';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ user: User; session: Session | undefined; }>;
    logout: () => Promise<void>;
    getProfile: () => Promise<Profile>;
    loginWithGoogle: () => Promise<void>;
    profile: Profile | null;
    updateProfile: (bio: string) => Promise<Profile>;
    deleteAccount: () => Promise<void>;
    authloading: boolean;
    uploadBanner: (file: File) => Promise<string>;
    createCollective: (collective: { name: string; description: string; guidelines: string; auto_approve: boolean; }) => Promise<Collective>;
    createEvent: (event: EventFormData) => Promise<Event>;
    delistEvent: (eventId: string) => Promise<Event>;
    relistEvent: (eventId: string) => Promise<Event | null>;
    createTicket: (eventId: string) => Promise<void>;
    joinCollective: (collectiveId: string) => Promise<void>;
    leaveCollective: (collectiveId: string) => Promise<void>;
    followCollective: (collectiveId: string) => Promise<void>;
    unfollowCollective: (collectiveId: string) => Promise<void>;
    getUserCollectives: () => Promise<Collective[]>;
    AddBookmark: (eventId: string) => Promise<void>;
    addEventToCollective: (eventId: string, collectiveId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);