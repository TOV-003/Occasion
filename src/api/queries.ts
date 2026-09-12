import { redirect } from 'react-router-dom';
import { supabase } from './SupabaseClient';
import type {
    Bookmarks,
    CollectiveFollower,
    CollectiveMember,
    CollectiveWithRelations,
    Event,
    Event_collective,
    Profile,
    TicketWithProfile,
    Tickets,
} from '../interfaces';

export const EVENT_WITH_DATES = '*, event_dates(*)';
export const COLLECTIVE_WITH_RELATIONS = '*, collective_members (*), collective_followers (*)';
export const PUBLIC_PROFILE_FIELDS = 'id, full_name, avatar_url, bio';

/** Row shape of the `featured_events` view used on the home page. */
export interface FeaturedEvent {
    event_id: string;
    event_title: string;
    event_banner_url: string;
    event_category: string;
    event_date: string;
}

interface EventQueryOptions {
    orderByCreatedAt?: boolean;
    /** Inclusive lower bound on `event_dates.date` as a local `YYYY-MM-DD` string. */
    fromDate?: string;
}

export async function currentUserId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user.id ?? null;
}

/** Resolves the signed-in user's id, or redirects to /login when there is no session. */
export async function requireUserId(): Promise<string> {
    const userId = await currentUserId();
    if (!userId)
        throw redirect('/login');
    return userId;
}

export async function fetchFeaturedEvents(): Promise<FeaturedEvent[]> {
    const { data, error } = await supabase.from('featured_events').select('*');
    if (error)
        throw error;
    return (data ?? []) as FeaturedEvent[];
}

/** Returns [] for anonymous visitors instead of querying. */
export async function fetchBookmarks(userId: string | null, orderByCreatedAt = false): Promise<Bookmarks[]> {
    if (!userId)
        return [];
    let query = supabase.from('bookmarks').select('*').eq('user_id', userId);
    if (orderByCreatedAt)
        query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error)
        throw error;
    return (data ?? []) as Bookmarks[];
}

export async function fetchEventWithDates(id: string): Promise<Event> {
    const { data, error } = await supabase.from('events').select(EVENT_WITH_DATES).eq('id', id).single();
    if (error)
        throw error;
    if (!data)
        throw new Response('Event not found', { status: 404 });
    return data as Event;
}

export async function fetchEventsWithDates(ids: string[], options: EventQueryOptions = {}): Promise<Event[]> {
    if (ids.length === 0)
        return [];
    let query = supabase.from('events').select(EVENT_WITH_DATES).in('id', ids);
    if (options.fromDate)
        query = query.gte('event_dates.date', options.fromDate);
    if (options.orderByCreatedAt)
        query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error)
        throw error;
    return (data ?? []) as Event[];
}

export async function fetchEventsByCreator(creatorId: string): Promise<Event[]> {
    const { data, error } = await supabase
        .from('events')
        .select(EVENT_WITH_DATES)
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    return (data ?? []) as Event[];
}

/** Dashboard only needs the raw columns, not the `event_dates` join. */
export async function fetchCreatorEventRows(creatorId: string): Promise<Event[]> {
    const { data, error } = await supabase.from('events').select('*').eq('creator_id', creatorId);
    if (error)
        throw error;
    return (data ?? []) as Event[];
}

export async function fetchCollectiveWithRelations(id: string): Promise<CollectiveWithRelations> {
    const { data, error } = await supabase.from('collectives').select(COLLECTIVE_WITH_RELATIONS).eq('id', id).single();
    if (error)
        throw error;
    if (!data)
        throw new Response('Collective not found', { status: 404 });
    return data as CollectiveWithRelations;
}

export async function fetchCollectivesByIds(ids: string[], orderByCreatedAt = false): Promise<CollectiveWithRelations[]> {
    if (ids.length === 0)
        return [];
    let query = supabase.from('collectives').select(COLLECTIVE_WITH_RELATIONS).in('id', ids);
    if (orderByCreatedAt)
        query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error)
        throw error;
    return (data ?? []) as CollectiveWithRelations[];
}

export async function fetchCollectivesByOwner(ownerId: string): Promise<CollectiveWithRelations[]> {
    const { data, error } = await supabase
        .from('collectives')
        .select(COLLECTIVE_WITH_RELATIONS)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    return (data ?? []) as CollectiveWithRelations[];
}

export async function fetchCollectiveMembers(collectiveId: string, orderByCreatedAt = false): Promise<CollectiveMember[]> {
    let query = supabase.from('collective_members').select('*').eq('collective_id', collectiveId);
    if (orderByCreatedAt)
        query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error)
        throw error;
    return (data ?? []) as CollectiveMember[];
}

export async function fetchCollectiveFollowers(collectiveId: string): Promise<CollectiveFollower[]> {
    const { data, error } = await supabase.from('collective_followers').select('*').eq('collective_id', collectiveId);
    if (error)
        throw error;
    return (data ?? []) as CollectiveFollower[];
}

/** Approved memberships of a user, used to resolve the collectives they belong to. */
export async function fetchApprovedMembershipIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('collective_members')
        .select('collective_id')
        .eq('user_id', userId)
        .eq('status', 'approved');
    if (error)
        throw error;
    return (data ?? []).map(function (row: { collective_id: string }) {
        return row.collective_id;
    });
}

export async function fetchFollowedCollectiveIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('collective_followers')
        .select('collective_id')
        .eq('user_id', userId);
    if (error)
        throw error;
    return (data ?? []).map(function (row: { collective_id: string }) {
        return row.collective_id;
    });
}

/** Memberships of a user in any state, used by the dashboard hosting tab. */
export async function fetchMembershipsForUser(userId: string): Promise<CollectiveMember[]> {
    const { data, error } = await supabase.from('collective_members').select('*').eq('user_id', userId);
    if (error)
        throw error;
    return (data ?? []) as CollectiveMember[];
}

export async function fetchProfile(id: string, fields = '*'): Promise<Profile> {
    const { data, error } = await supabase.from('profiles').select(fields).eq('id', id).single();
    if (error)
        throw error;
    return data as unknown as Profile;
}

/** Pass `optional` when a profile lookup failing should not break the whole page. */
export async function fetchPublicProfiles(ids: string[], optional = false): Promise<Profile[]> {
    if (ids.length === 0)
        return [];
    const { data, error } = await supabase.from('profiles').select(PUBLIC_PROFILE_FIELDS).in('id', ids);
    if (error) {
        if (!optional)
            throw error;
        console.warn('Failed to fetch profiles:', error);
        return [];
    }
    return (data ?? []) as Profile[];
}

/** Tickets for an event that still hold a slot, with check-in state attached. */
export async function fetchEventTickets(eventId: string): Promise<Tickets[]> {
    const { data, error } = await supabase
        .from('tickets')
        .select('*, check_in_data')
        .eq('event_id', eventId)
        .in('status', ['approved', 'pending', 'waitlist']);
    if (error)
        throw error;
    return (data ?? []) as Tickets[];
}

/** Every ticket for an event (including rejected) with the attendee profile embedded. */
export async function fetchEventTicketsWithProfiles(eventId: string): Promise<TicketWithProfile[]> {
    const { data, error } = await supabase
        .from('tickets')
        .select('*, check_in_data, profiles(id, full_name, avatar_url)')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    return (data ?? []) as TicketWithProfile[];
}

export async function fetchTicketsForUser(userId: string): Promise<Tickets[]> {
    const { data, error } = await supabase.from('tickets').select('*, check_in_data').eq('user_id', userId);
    if (error)
        throw error;
    return (data ?? []) as Tickets[];
}

export async function fetchApprovedTicketsForUser(userId: string): Promise<Tickets[]> {
    const { data, error } = await supabase
        .from('tickets')
        .select('id, event_id, status, checked_in, check_in_data')
        .eq('user_id', userId)
        .eq('status', 'approved');
    if (error)
        throw error;
    return (data ?? []) as Tickets[];
}

export async function fetchApprovedTicketsForEvents(eventIds: string[]): Promise<Tickets[]> {
    if (eventIds.length === 0)
        return [];
    const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .in('event_id', eventIds)
        .eq('status', 'approved');
    if (error)
        throw error;
    return (data ?? []) as Tickets[];
}

export async function fetchCollectiveForEvent(eventId: string): Promise<CollectiveWithRelations | null> {
    const { data: link, error: linkError } = await supabase
        .from('event_collectives')
        .select('collective_id')
        .eq('event_id', eventId)
        .maybeSingle();
    if (linkError)
        throw linkError;
    if (!link)
        return null;
    return fetchCollectiveWithRelations((link as { collective_id: string }).collective_id);
}

/** Approved event links of a collective, used to load the collective's upcoming events. */
export async function fetchApprovedEventIds(collectiveId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('event_collectives')
        .select('event_id')
        .eq('collective_id', collectiveId)
        .eq('status', 'approved');
    if (error)
        throw error;
    return (data ?? []).map(function (row: { event_id: string }) {
        return row.event_id;
    });
}

export async function fetchEventCollectiveRows(collectiveId: string): Promise<Event_collective[]> {
    const { data, error } = await supabase
        .from('event_collectives')
        .select('*')
        .eq('collective_id', collectiveId)
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    return (data ?? []) as Event_collective[];
}

/** Returns the access-staff row for a user on an event, or null when they are not staff. */
export async function fetchEventAccessStaffRow(eventId: string, userId: string): Promise<{ id: string } | null> {
    const { data } = await supabase
        .from('event_access_staff')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();
    return (data as { id: string } | null) ?? null;
}
