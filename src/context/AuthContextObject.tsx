import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, Event, EventFormData, Collective, EventServiceStaff, EventAccessStaff } from '../interfaces';
interface AuthContextType {
    user: User | null;
    login(email: string, password: string): Promise<{
        user: User;
        session: Session | undefined;
    }>;
    logout(): Promise<void>;
    getProfile(): Promise<Profile>;
    loginWithGoogle(): Promise<void>;
    profile: Profile | null;
    updateProfile(bio: string): Promise<Profile>;
    deleteAccount(): Promise<void>;
    authloading: boolean;
    uploadBanner(file: File): Promise<string>;
    createCollective(collective: {
        name: string;
        description: string;
        guidelines: string;
        auto_approve: boolean;
    }): Promise<Collective>;
    createEvent(event: EventFormData): Promise<Event>;
    HandleEditEvent(eventId: string, event: EventFormData): Promise<Event>;
    delistEvent(eventId: string): Promise<Event>;
    relistEvent(eventId: string): Promise<Event | null>;
    createTicket(eventId: string): Promise<void>;
    joinCollective(collectiveId: string): Promise<void>;
    leaveCollective(collectiveId: string): Promise<void>;
    followCollective(collectiveId: string): Promise<void>;
    unfollowCollective(collectiveId: string): Promise<void>;
    getUserCollectives(): Promise<Collective[]>;
    AddBookmark(eventId: string): Promise<void>;
    addEventToCollective(eventId: string, collectiveId: string): Promise<void>;
    approveMember(memberId: string): Promise<void>;
    rejectMember(memberId: string): Promise<void>;
    approveCollectiveEvent(eventId: string, collectiveId: string): Promise<void>;
    rejectCollectiveEvent(eventId: string, collectiveId: string): Promise<void>;
    approveTicket(ticketId: string): Promise<void>;
    rejectTicket(ticketId: string): Promise<void>;
    HandleAddEventServiceStaff(eventId: string, staffOrCompanyName: string, phone: string, role: string): Promise<void>;
    HandleAddEventAccessStaff(eventId: string, userId: string): Promise<void>;
    getServiceStaff(eventId: string): Promise<EventServiceStaff[]>;
    getAccessStaff(eventId: string): Promise<EventAccessStaff[]>;
    handleRemoveServiceStaff(staffId: string): Promise<void>;
    handleRemoveAccessStaff(staffId: string): Promise<void>;
}
export const AuthContext = createContext<AuthContextType | null>(null);
