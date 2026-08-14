import { AuthContext } from './AuthContextObject';
import { supabase } from '../api/SupabaseClient';
import type { User } from '@supabase/supabase-js';
import type { Profile, Event, EventFormData, Collective } from '../interfaces';
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
    };

    async function loginWithGoogle() {
        toast.loading("Logging in with Google...", { duration: 1500 });
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/settings` }
        })
        if (error) throw error
    };

    async function logout() {
        await supabase.auth.signOut();
        setProfile(null);
    };

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
    };

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

    async function uploadBanner(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error } = await supabase.storage
            .from('Banners')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;

        const { data } = supabase.storage.from('Banners').getPublicUrl(filePath);
        return data.publicUrl;
    };

    async function createEvent(event: EventFormData): Promise<Event> {
        const { event_dates, ...eventPayload } = event;
        const { data, error } = await supabase
            .from('events')
            .insert({
                ...eventPayload,
                creator_id: user?.id,
            })
            .select('*')
            .single();

        if (error) { toast.error("Failed to create event"); throw error; }
        const dateRows = event_dates.map((date) => ({
            event_id: data.id,
            date,
        }));

        const { error: datesError } = await supabase
            .from('event_dates')
            .insert(dateRows);

        if (datesError) { await supabase.from('events').delete().eq('id', data.id); toast.error("Failed to create event dates"); throw datesError; }
        return data;
    };

    async function delistEvent(eventId: string): Promise<Event> {
        toast.loading("Delisting event...", { duration: 500 });
        const { data, error } = await supabase
            .from('events')
            .update({ isActive: false })
            .eq('id', eventId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async function relistEvent(eventId: string): Promise<Event | null> {
        const { data: eventCheck, error: fetchError } = await supabase
            .from('events')
            .select('event_dates(date)')
            .eq('id', eventId)
            .single();

        if (fetchError) throw fetchError;

        const today = new Date().toISOString().split('T')[0];
        const hasUpcomingDate = eventCheck?.event_dates?.some(
            (d: { date: string }) => d.date >= today
        );

        if (!hasUpcomingDate) {
            toast.error("Can't relist — the Event's dates have passed.");
            return null;
        }

        toast.loading("Relisting event...", { duration: 500 });
        const { data, error } = await supabase
            .from('events')
            .update({ isActive: true })
            .eq('id', eventId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async function createTicket(eventId: string): Promise<void> {
        const { data: Event, error: EventError } = await supabase
            .from('events_with_counts')
            .select('*')
            .eq('id', eventId)
            .single();

        if (EventError) throw new Error('Event not found');

        const { error } = await supabase
            .from('tickets')
            .insert({ event_id: eventId, user_id: user?.id, status: Event.auto_approve ? 'approved' : 'pending' })
            .select()
            .single();

        if (error) throw error;
        toast.success("Ticket created successfully");
    }

    async function joinCollective(collectiveId: string): Promise<void> {
        toast.loading("Joining collective...", { duration: 500 });
        let autoApprove = false;
        const { data, error: collectiveError } = await supabase
            .from('collectives')
            .select('*')
            .eq('id', collectiveId)
            .single();
        if (collectiveError) throw collectiveError;

        if (data.auto_approve === true) {
            autoApprove = true;
            toast.success("Automatically approved to join collective");
        }

        const { error } = await supabase
            .from('collective_members')
            .insert({ collective_id: collectiveId, user_id: user?.id, role: 'member', status: autoApprove ? 'approved' : 'pending' });
        if (error) throw error;
    }

    async function leaveCollective(collectiveId: string): Promise<void> {
        toast.loading("Leaving collective...", { duration: 500 });
        const { error } = await supabase
            .from('collective_members')
            .delete()
            .eq('collective_id', collectiveId)
            .eq('user_id', user?.id);
        if (error) throw error;
    }

    async function followCollective(collectiveId: string): Promise<void> {
        toast.loading("Following collective...", { duration: 500 });
        const { error } = await supabase
            .from('collective_followers')
            .insert({ collective_id: collectiveId, user_id: user?.id })
            .select()
            .maybeSingle();
        if (error) throw error;
    }

    async function unfollowCollective(collectiveId: string): Promise<void> {
        toast.loading("Unfollowing collective...", { duration: 500 });
        const { error } = await supabase
            .from('collective_followers')
            .delete()
            .eq('collective_id', collectiveId)
            .eq('user_id', user?.id);
        if (error) throw error;
    }

    async function getUserCollectives(): Promise<Collective[]> {
        if (!user) {
            throw new Error('Not authenticated');
        }

        const { data: ownedCollectives, error: ownedCollectivesError } = await supabase
            .from('collectives')
            .select('*')
            .eq('owner_id', user.id);

        if (ownedCollectivesError) throw ownedCollectivesError;

        const { data: userEvents, error: userEventsError } = await supabase
            .from('events')
            .select('id')
            .eq('creator_id', user.id);

        if (userEventsError) throw userEventsError;

        const eventIds = (userEvents ?? []).map((event) => event.id);
        const collectiveIds = new Set<string>();

        if (eventIds.length > 0) {
            const { data: linkedCollectives, error: linkedCollectivesError } = await supabase
                .from('event_collectives')
                .select('collective_id')
                .in('event_id', eventIds);

            if (linkedCollectivesError) throw linkedCollectivesError;

            (linkedCollectives ?? []).forEach((row) => collectiveIds.add(row.collective_id));
        }

        // Also include collectives where the user is a member
        const { data: memberCollectives, error: memberCollectivesError } = await supabase
            .from('collective_members')
            .select('collective_id, status')
            .eq('user_id', user.id);

        if (memberCollectivesError) throw memberCollectivesError;

        (memberCollectives ?? []).forEach((row) => collectiveIds.add(row.collective_id));

        const ownedIds = (ownedCollectives ?? []).map((collective) => collective.id);
        ownedIds.forEach((id) => collectiveIds.add(id));

        if (collectiveIds.size === 0) {
            return [];
        }

        const { data: collectives, error } = await supabase
            .from('collectives')
            .select('*')
            .in('id', Array.from(collectiveIds));

        if (error) throw error;
        return collectives ?? [];
    }

    async function AddBookmark(eventId: string): Promise<void> {
        if (!user) {
            throw new Error('Not authenticated');
        }

        const { data: existing, error: selectError } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', user.id)
            .eq('event_id', eventId)
            .maybeSingle();

        if (selectError) throw selectError;

        if (existing) {
            const { error: deleteError } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', user.id)
                .eq('id', existing.id);

            if (deleteError) throw deleteError;
            toast.success('Removed bookmark');
            return;
        }


        const { error: insertError } = await supabase
            .from('bookmarks')
            .insert({ user_id: user.id, event_id: eventId })
            .select()
            .maybeSingle();

        if (insertError) throw insertError;
        toast.success('Added bookmark');
    }

    async function addEventToCollective(eventId: string, collectiveId: string): Promise<void> {
        toast.loading("Adding event to collective...", { duration: 500 });
        const { data: existing, error: selectError } = await supabase
            .from('collectives')
            .select('*')
            .eq('id', collectiveId)
            .single();

        if (selectError) {
            toast.error("Failed to find collective");
            throw selectError;
        };

        if (existing.auto_approve === true) {
            const { error } = await supabase
                .from('event_collectives')
                .insert({ event_id: eventId, collective_id: collectiveId, status: 'approved' })
            if (error) {
                toast.error("Failed to add event to collective");
                throw error;
            };
        }

        if (existing.auto_approve === false) {
            const { error } = await supabase
                .from('event_collectives')
                .insert({ event_id: eventId, collective_id: collectiveId, status: 'pending' })
            if (error) {
                toast.error("Failed to add event to collective");
                throw error;
            };
        }

    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            authloading, 
            login, 
            loginWithGoogle, 
            logout, 
            getProfile, 
            profile, 
            updateProfile, 
            deleteAccount, 
            uploadBanner, 
            createEvent, 
            delistEvent, 
            relistEvent, 
            createTicket, 
            joinCollective, 
            leaveCollective, 
            followCollective, 
            unfollowCollective, 
            getUserCollectives, 
            AddBookmark,
            addEventToCollective
             }}>
            {children}
        </AuthContext.Provider>
    );

}