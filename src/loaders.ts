import { redirect } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import {
    fetchApprovedEventIds,
    fetchApprovedMembershipIds,
    fetchApprovedTicketsForEvents,
    fetchApprovedTicketsForUser,
    fetchBookmarks,
    fetchCollectiveFollowers,
    fetchCollectiveForEvent,
    fetchCollectiveMembers,
    fetchCollectiveWithRelations,
    fetchCollectivesByIds,
    fetchCollectivesByOwner,
    fetchCreatorEventRows,
    fetchEventAccessStaffRow,
    fetchEventCollectiveRows,
    fetchEventTickets,
    fetchEventTicketsWithProfiles,
    fetchEventWithDates,
    fetchEventsByCreator,
    fetchEventsWithDates,
    fetchFeaturedEvents,
    fetchFollowedCollectiveIds,
    fetchMembershipsForUser,
    fetchProfile,
    fetchPublicProfiles,
    fetchTicketsForUser,
    currentUserId,
    requireUserId,
    PUBLIC_PROFILE_FIELDS,
} from './api/queries';
import type { FeaturedEvent } from './api/queries';
import type {
    Bookmarks,
    CollectiveFollower,
    CollectiveMember,
    CollectiveWithRelations,
    Event,
    Profile,
    TicketWithProfile,
    Tickets,
} from './interfaces';
import { todayISO } from './utils/date';

export interface HomeLoaderData {
    featuredEvents: FeaturedEvent[];
    bookmarks: Bookmarks[];
}

export async function homeLoader(): Promise<HomeLoaderData> {
    const userId = await currentUserId();
    const [featuredEvents, bookmarks] = await Promise.all([
        fetchFeaturedEvents(),
        fetchBookmarks(userId),
    ]);
    return { featuredEvents, bookmarks };
}

export interface EventLoaderData {
    event: Event;
    tickets: Tickets[];
    eventCollective: CollectiveWithRelations | null;
    bookmarks: Bookmarks[];
}

export async function eventLoader({ params }: LoaderFunctionArgs): Promise<EventLoaderData> {
    const id = params.id;
    if (!id)
        throw new Error('Event ID required');
    const userId = await currentUserId();
    const [event, tickets, eventCollective, bookmarks] = await Promise.all([
        fetchEventWithDates(id),
        fetchEventTickets(id),
        fetchCollectiveForEvent(id),
        fetchBookmarks(userId),
    ]);
    return { event, tickets, eventCollective, bookmarks };
}

export interface CollectiveLoaderData {
    collective: CollectiveWithRelations;
    collectiveMembers: CollectiveMember[];
    collectiveFollowers: CollectiveFollower[];
    events: Event[];
    tickets: Tickets[];
    memberProfiles: Profile[];
    bookmarks: Bookmarks[];
}

export async function collectiveLoader({ params }: LoaderFunctionArgs): Promise<CollectiveLoaderData> {
    const id = params.id;
    if (!id)
        throw new Error('Collective ID required');
    const today = todayISO();
    const userId = await currentUserId();
    const [collective, collectiveMembers, collectiveFollowers, approvedEventIds, bookmarks] = await Promise.all([
        fetchCollectiveWithRelations(id),
        fetchCollectiveMembers(id),
        fetchCollectiveFollowers(id),
        fetchApprovedEventIds(id),
        fetchBookmarks(userId),
    ]);
    const [events, tickets, memberProfiles] = await Promise.all([
        fetchEventsWithDates(approvedEventIds, { fromDate: today }),
        fetchApprovedTicketsForEvents(approvedEventIds),
        fetchPublicProfiles(collectiveMembers.map(function (member) {
            return member.user_id;
        }), true),
    ]);
    return {
        collective,
        collectiveMembers,
        collectiveFollowers,
        events,
        tickets,
        memberProfiles,
        bookmarks,
    };
}

export interface ProfileLoaderData {
    profile: Profile;
    createdEvents: Event[];
    ownedCollectives: CollectiveWithRelations[];
    memberCollectives: CollectiveWithRelations[];
    attendingEvents: Event[];
    tickets: Tickets[];
    bookmarks: Bookmarks[];
    followedCollectives: CollectiveWithRelations[];
}

export async function profileLoader({ params }: LoaderFunctionArgs): Promise<ProfileLoaderData> {
    const id = params.id;
    if (!id)
        throw new Error('Profile ID required');
    const today = todayISO();
    const [profile, createdEvents, ownedCollectives, memberIds, tickets, bookmarks, followedIds] = await Promise.all([
        fetchProfile(id),
        fetchEventsByCreator(id),
        fetchCollectivesByOwner(id),
        fetchApprovedMembershipIds(id),
        fetchApprovedTicketsForUser(id),
        fetchBookmarks(id),
        fetchFollowedCollectiveIds(id),
    ]);
    const [memberCollectives, followedCollectives, attendingEventRows] = await Promise.all([
        fetchCollectivesByIds(memberIds, true),
        fetchCollectivesByIds(followedIds, true),
        fetchEventsWithDates(tickets.map(function (ticket) {
            return ticket.event_id;
        }), { fromDate: today, orderByCreatedAt: true }),
    ]);
    const attendingEvents = attendingEventRows.filter(function (event) {
        return event.creator_id !== id;
    });
    return {
        profile,
        createdEvents,
        ownedCollectives,
        memberCollectives,
        attendingEvents,
        tickets,
        bookmarks,
        followedCollectives,
    };
}

export interface BookmarksLoaderData {
    bookmarkedEvents: Event[];
}

export async function bookmarksLoader(): Promise<BookmarksLoaderData> {
    const userId = await requireUserId();
    const bookmarks = await fetchBookmarks(userId, true);
    const bookmarkedEvents = await fetchEventsWithDates(bookmarks.map(function (bookmark) {
        return bookmark.event_id;
    }), { orderByCreatedAt: true });
    return { bookmarkedEvents };
}

export interface DashboardLoaderData {
    Profile: Profile;
    Tickets: Tickets[];
    Events: Event[];
    Collectives: CollectiveMember[];
    Attending: Event[];
    CollectiveList: CollectiveWithRelations[];
}

export async function dashboardLoader(): Promise<DashboardLoaderData> {
    const userId = await requireUserId();
    const [Profile, Tickets, Events, Collectives] = await Promise.all([
        fetchProfile(userId, PUBLIC_PROFILE_FIELDS),
        fetchTicketsForUser(userId),
        fetchCreatorEventRows(userId),
        fetchMembershipsForUser(userId),
    ]);
    const [Attending, CollectiveList] = await Promise.all([
        fetchEventsWithDates(Tickets.map(function (ticket) {
            return ticket.event_id;
        })),
        fetchCollectivesByIds(Collectives.map(function (membership) {
            return membership.collective_id;
        })),
    ]);
    return { Profile, Tickets, Events, Collectives, Attending, CollectiveList };
}

export interface ManageEventLoaderData {
    event: Event;
    tickets: TicketWithProfile[];
    approvedTickets: TicketWithProfile[];
    pendingTickets: TicketWithProfile[];
    rejectedTickets: TicketWithProfile[];
    profiles: Profile[];
    isCreator: boolean;
    isAccessStaff: boolean;
}

export async function manageEventLoader({ params }: LoaderFunctionArgs): Promise<ManageEventLoaderData> {
    const id = params.id;
    if (!id)
        throw redirect('/dashboard');
    const userId = await requireUserId();
    const event = await fetchEventWithDates(id);
    const accessStaffRow = await fetchEventAccessStaffRow(id, userId);
    const isCreator = event.creator_id === userId;
    const isAccessStaff = Boolean(accessStaffRow);
    if (!isCreator && !isAccessStaff)
        throw redirect(`/event/${id}`);
    const tickets = await fetchEventTicketsWithProfiles(id);
    const userIds = [...new Set(tickets.map(function (ticket) {
            return ticket.user_id;
        }))];
    const profiles = await fetchPublicProfiles(userIds);
    return {
        event,
        tickets,
        approvedTickets: tickets.filter(function (ticket) {
            return ticket.status === 'approved';
        }),
        pendingTickets: tickets.filter(function (ticket) {
            return ticket.status === 'pending';
        }),
        rejectedTickets: tickets.filter(function (ticket) {
            return ticket.status === 'rejected';
        }),
        profiles,
        isCreator,
        isAccessStaff,
    };
}

export interface ManageCollectiveLoaderData {
    collective: CollectiveWithRelations;
    approvedEvents: Event[];
    pendingEvents: Event[];
    approvedMembers: CollectiveMember[];
    pendingMembers: CollectiveMember[];
    memberProfiles: Profile[];
    members: CollectiveMember[];
    followers: CollectiveFollower[];
}

export async function manageCollectiveLoader({ params }: LoaderFunctionArgs): Promise<ManageCollectiveLoaderData> {
    const id = params.id;
    if (!id)
        throw redirect('/collectives');
    const userId = await requireUserId();
    const collective = await fetchCollectiveWithRelations(id);
    if (collective.owner_id !== userId)
        throw redirect(`/collective/${id}`);
    const [linkedEvents, memberRows] = await Promise.all([
        fetchEventCollectiveRows(id),
        fetchCollectiveMembers(id, true),
    ]);
    const eventIds = linkedEvents.map(function (row) {
        return row.event_id;
    });
    const [events, memberProfiles] = await Promise.all([
        fetchEventsWithDates(eventIds, { orderByCreatedAt: true }),
        fetchPublicProfiles(memberRows.map(function (member) {
            return member.user_id;
        })),
    ]);
    const visibleMemberRows = memberRows.filter(function (member) {
        return member.user_id !== collective.owner_id;
    });
    function eventsWithStatus(status: string) {
        return linkedEvents
            .filter(function (row) {
            return row.status === status;
        })
            .map(function (row) {
            return events.find(function (event) {
                return event.id === row.event_id;
            });
        })
            .filter(function (event): event is Event {
            return Boolean(event);
        });
    }
    return {
        collective,
        approvedEvents: eventsWithStatus('approved'),
        pendingEvents: eventsWithStatus('pending'),
        approvedMembers: visibleMemberRows.filter(function (member) {
            return member.status === 'approved';
        }),
        pendingMembers: visibleMemberRows.filter(function (member) {
            return member.status === 'pending';
        }),
        memberProfiles,
        members: visibleMemberRows,
        followers: collective.collective_followers ?? [],
    };
}
