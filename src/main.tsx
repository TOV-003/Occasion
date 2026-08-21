import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import AuthContextProvider from './context/AuthContext';
import './index.css';
import App from './App.tsx';
import { supabase } from './api/SupabaseClient';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import type { Event, Collective, CollectiveWithRelations } from './interfaces';
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About.tsx';
import EventPage from './pages/EventPage';
import ErrorPage from './components/ErrorPage';
import LoadingFallback from './components/LoadingFallback';
import CollectivePage from './pages/CollectivePage.tsx';
import Profile from './pages/Profile';
import Settings from './pages/Settings.tsx';
import Dashboard from './pages/Dashboard';
import Collectives from './pages/Collectives';
import NewEvent from './pages/NewEvent';
import NewCollective from './pages/NewCollective';
import UploadImageTest from './pages/UploadImageTest';
import ManageCollective from './pages/ManageCollective';
import ManageEvent from './pages/ManageEvent';
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
                loader: async function () {
                    const { data: { session } } = await supabase.auth.getSession();
                    const userId = session?.user.id;
                    const [featuredEventsResult, bookmarksResult] = await Promise.all([
                        supabase.from('featured_events').select('*'),
                        userId ? supabase.from('bookmarks').select('*').eq('user_id', userId) : Promise.resolve({ data: [], error: null })
                    ]);
                    if (featuredEventsResult.error)
                        throw featuredEventsResult.error;
                    if (bookmarksResult.error)
                        throw bookmarksResult.error;
                    return {
                        featuredEvents: featuredEventsResult.data,
                        bookmarks: bookmarksResult.data
                    };
                },
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/about',
                element: <About />
            },
            {
                path: '/event/:id',
                element: <EventPage />,
                loader: async function ({ params }) {
                    const { id } = params;
                    if (!id)
                        throw new Error('Event ID required');
                    const { data: { session } } = await supabase.auth.getSession();
                    const userId = session?.user.id;
                    const [eventResult, ticketsResult, collectiveLinkResult, bookmarksResult] = await Promise.all([
                        supabase.from('events').select('*, event_dates(*)').eq('id', id).single(),
                        supabase.from('tickets').select('*, check_in_data').eq('event_id', id).in('status', ['approved', 'pending']),
                        supabase.from('event_collectives').select('collective_id').eq('event_id', id).maybeSingle(),
                        userId ? supabase.from('bookmarks').select('*').eq('user_id', userId) : Promise.resolve({ data: [], error: null })
                    ]);
                    if (eventResult.error)
                        throw eventResult.error;
                    if (!eventResult.data)
                        throw new Response('Event not found', { status: 404 });
                    if (ticketsResult.error)
                        throw ticketsResult.error;
                    if (collectiveLinkResult.error)
                        throw collectiveLinkResult.error;
                    if (bookmarksResult.error)
                        throw bookmarksResult.error;
                    let eventCollective = null;
                    const collectiveLink = collectiveLinkResult.data;
                    if (collectiveLink) {
                        const { data: collective, error: collectiveError } = await supabase
                            .from('collectives')
                            .select(`*, collective_members (*), collective_followers (*)`)
                            .eq('id', collectiveLink.collective_id)
                            .single();
                        if (collectiveError)
                            throw collectiveError;
                        eventCollective = collective;
                    }
                    return {
                        event: eventResult.data,
                        tickets: ticketsResult.data,
                        eventCollective,
                        bookmarks: bookmarksResult.data
                    };
                },
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/collective/:id',
                element: <CollectivePage />,
                loader: async function ({ params }) {
                    const { id } = params;
                    if (!id)
                        throw new Error('Collective ID required');
                    const today = new Date().toLocaleDateString('en-CA');
                    const { data: { session } } = await supabase.auth.getSession();
                    const userId = session?.user.id;
                    const [collectiveResult, collectiveMembersResult, collectiveFollowersResult, collectiveEventsResult, bookmarksResult] = await Promise.all([
                        supabase
                            .from('collectives')
                            .select('*, collective_members (*), collective_followers (*)')
                            .eq('id', id)
                            .single(),
                        supabase
                            .from('collective_members')
                            .select('*')
                            .eq('collective_id', id),
                        supabase
                            .from('collective_followers')
                            .select('*')
                            .eq('collective_id', id),
                        supabase
                            .from('event_collectives')
                            .select('event_id')
                            .eq('collective_id', id)
                            .eq('status', 'approved'),
                        userId ? supabase.from('bookmarks').select('*').eq('user_id', userId) : Promise.resolve({ data: [], error: null })
                    ]);
                    if (collectiveResult.error)
                        throw collectiveResult.error;
                    if (collectiveMembersResult.error)
                        throw collectiveMembersResult.error;
                    if (collectiveFollowersResult.error)
                        throw collectiveFollowersResult.error;
                    if (collectiveEventsResult.error)
                        throw collectiveEventsResult.error;
                    if (bookmarksResult.error)
                        throw bookmarksResult.error;
                    const userIds = collectiveMembersResult.data?.map(function (m) {
                        return m.user_id;
                    }) || [];
                    let memberProfiles: {
                        id: string;
                        full_name: string;
                        avatar_url: string;
                        bio?: string;
                    }[] = [];
                    if (userIds.length > 0) {
                        const { data: profiles, error: profilesError } = await supabase
                            .from('profiles')
                            .select('id, full_name, avatar_url, bio')
                            .in('id', userIds);
                        if (!profilesError) {
                            memberProfiles = profiles || [];
                        }
                        else {
                            console.warn('Failed to fetch member profiles:', profilesError);
                        }
                    }
                    const eventIds = collectiveEventsResult.data?.map(function (ec) {
                        return ec.event_id;
                    }) || [];
                    let events = [];
                    let tickets = [];
                    if (eventIds.length > 0) {
                        const { data: eventsData, error: eventsError } = await supabase
                            .from('events')
                            .select('*, event_dates(*)')
                            .in('id', eventIds)
                            .gte('event_dates.date', today);
                        if (eventsError)
                            throw eventsError;
                        events = eventsData || [];
                        const { data: ticketsData, error: ticketsError } = await supabase
                            .from('tickets')
                            .select('*')
                            .in('event_id', eventIds)
                            .eq('status', 'approved');
                        if (ticketsError)
                            throw ticketsError;
                        tickets = ticketsData || [];
                    }
                    return {
                        collective: collectiveResult.data,
                        collectiveMembers: collectiveMembersResult.data,
                        collectiveFollowers: collectiveFollowersResult.data,
                        events,
                        tickets,
                        memberProfiles,
                        bookmarks: bookmarksResult.data
                    };
                },
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/profile/:id',
                element: <Profile />,
                loader: async function ({ params }) {
                    const { id } = params;
                    if (!id)
                        throw new Error('Profile ID required');
                    const today = new Date().toLocaleDateString('en-CA');
                    const [{ data: profile, error: profileError }, { data: createdEvents, error: eventsError }, { data: ownedCollectives, error: ownedError }, { data: memberRows, error: memberRowsError }, { data: tickets, error: ticketsError }, { data: bookmarks, error: bookmarksError }, { data: followedRows, error: followedError }] = await Promise.all([
                        supabase.from('profiles').select('*').eq('id', id).single(),
                        supabase.from('events').select('*, event_dates(*)').eq('creator_id', id).order('created_at', { ascending: false }),
                        supabase.from('collectives').select('*, collective_members (*), collective_followers (*)').eq('owner_id', id).order('created_at', { ascending: false }),
                        supabase.from('collective_members').select('collective_id').eq('user_id', id).eq('status', 'approved'),
                        supabase.from('tickets').select('event_id, status, checked_in, check_in_data').eq('user_id', id).eq('status', 'approved'),
                        supabase.from('bookmarks').select('*').eq('user_id', id),
                        supabase.from('collective_followers').select('collective_id').eq('user_id', id)
                    ]);
                    if (profileError)
                        throw profileError;
                    if (eventsError)
                        throw eventsError;
                    if (ownedError)
                        throw ownedError;
                    if (memberRowsError)
                        throw memberRowsError;
                    if (ticketsError)
                        throw ticketsError;
                    if (bookmarksError)
                        throw bookmarksError;
                    if (followedError)
                        throw followedError;
                    let memberCollectives: Collective[] = [];
                    const memberIds = (memberRows ?? []).map(function (row) {
                        return row.collective_id;
                    });
                    if (memberIds.length > 0) {
                        const { data: collectives, error: collectivesError } = await supabase
                            .from('collectives')
                            .select('*, collective_members (*), collective_followers (*)')
                            .in('id', memberIds)
                            .order('created_at', { ascending: false });
                        if (collectivesError)
                            throw collectivesError;
                        memberCollectives = collectives ?? [];
                    }
                    let attendingEvents: Event[] = [];
                    const eventIds = (tickets ?? []).map(function (ticket) {
                        return ticket.event_id;
                    });
                    if (eventIds.length > 0) {
                        const { data: events, error: eventsError } = await supabase
                            .from('events')
                            .select('*, event_dates(*)')
                            .in('id', eventIds)
                            .gte('event_dates.date', today)
                            .order('created_at', { ascending: false });
                        if (eventsError)
                            throw eventsError;
                        attendingEvents = (events ?? []).filter(function (event) {
                            return event.creator_id !== id;
                        });
                    }
                    let bookmarkedEvents: Event[] = [];
                    const bookmarkEventIds = (bookmarks ?? []).map(function (bookmark) {
                        return bookmark.event_id;
                    });
                    if (bookmarkEventIds.length > 0) {
                        const { data: bookmarkedEventsData, error: bookmarkedError } = await supabase
                            .from('events')
                            .select('*, event_dates(*)')
                            .in('id', bookmarkEventIds)
                            .order('created_at', { ascending: false });
                        if (bookmarkedError)
                            throw bookmarkedError;
                        bookmarkedEvents = bookmarkedEventsData ?? [];
                    }
                    let followedCollectives: Collective[] = [];
                    const followedIds = (followedRows ?? []).map(function (row) {
                        return row.collective_id;
                    });
                    if (followedIds.length > 0) {
                        const { data: followedData, error: followedCollectivesError } = await supabase
                            .from('collectives')
                            .select('*, collective_members (*), collective_followers (*)')
                            .in('id', followedIds)
                            .order('created_at', { ascending: false });
                        if (followedCollectivesError)
                            throw followedCollectivesError;
                        followedCollectives = followedData ?? [];
                    }
                    return {
                        profile,
                        createdEvents: createdEvents ?? [],
                        ownedCollectives: ownedCollectives ?? [],
                        memberCollectives,
                        attendingEvents,
                        bookmarks: bookmarks ?? [],
                        bookmarkedEvents,
                        followedCollectives
                    };
                },
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/settings',
                element: <Settings />,
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
                loader: async function () {
                    const { data: { session } } = await supabase.auth.getSession();
                    const userId = session?.user.id;
                    if (!userId) {
                        throw redirect('/login');
                    }
                    let Attending: Event[] = [];
                    let CollectiveList: CollectiveWithRelations[] = [];
                    const [Profile, Tickets, Events, Collectives] = await Promise.all([
                        supabase
                            .from('profiles')
                            .select('id, full_name, avatar_url, bio')
                            .eq('id', userId)
                            .single(),
                        supabase
                            .from('tickets')
                            .select('*, check_in_data')
                            .eq('user_id', userId),
                        supabase
                            .from('events')
                            .select('*')
                            .eq('creator_id', userId),
                        supabase
                            .from('collective_members')
                            .select('*')
                            .eq('user_id', userId)
                    ]);
                    if (Profile.error)
                        throw Profile.error;
                    if (Tickets.error)
                        throw Tickets.error;
                    if (Events.error)
                        throw Events.error;
                    if (Collectives.error)
                        throw Collectives.error;
                    const eventIds = Tickets.data?.map(function (t) {
                        return t.event_id;
                    }) || [];
                    if (eventIds.length > 0) {
                        const { data: events, error } = await supabase
                            .from('events')
                            .select('*, event_dates(*)')
                            .in('id', eventIds);
                        if (!error) {
                            Attending = events || [];
                        }
                    }
                    const collectiveIds = Collectives.data?.map(function (c) {
                        return c.collective_id;
                    }) || [];
                    if (collectiveIds.length > 0) {
                        const { data: collectives, error } = await supabase
                            .from('collectives')
                            .select('*, collective_members (*), collective_followers (*)')
                            .in('id', collectiveIds);
                        if (!error) {
                            CollectiveList = collectives || [];
                        }
                    }
                    return {
                        Profile: Profile.data,
                        Tickets: Tickets.data,
                        Events: Events.data,
                        Collectives: Collectives.data,
                        Attending,
                        CollectiveList
                    };
                },
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/collectives',
                element: <Collectives />,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/new-event',
                element: <NewEvent />,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/new-collective',
                element: <NewCollective />,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/upload-image-test',
                element: <UploadImageTest />,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/manage-event/:id',
                element: <ManageEvent />,
                loader: async function ({ params }) {
                    const { id } = params;
                    if (!id) {
                        throw redirect('/dashboard');
                    }
                    const { data: { session } } = await supabase.auth.getSession();
                    const userId = session?.user.id;
                    if (!userId) {
                        throw redirect('/login');
                    }
                    const { data: event, error: eventError } = await supabase
                        .from('events')
                        .select('*, event_dates(*)')
                        .eq('id', id)
                        .single();
                    if (eventError)
                        throw eventError;
                    if (!event)
                        throw new Response('Event not found', { status: 404 });
                    if (event.creator_id !== userId) {
                        throw redirect(`/event/${id}`);
                    }
                    const { data: ticketRows, error: ticketRowsError } = await supabase
                        .from('tickets')
                        .select('*, check_in_data, profiles(id, full_name, avatar_url)')
                        .eq('event_id', id)
                        .order('created_at', { ascending: false });
                    if (ticketRowsError)
                        throw ticketRowsError;
                    const userIds = [...new Set((ticketRows ?? []).map(function (ticket) {
                            return ticket.user_id;
                        }))];
                    let profiles: {
                        id: string;
                        full_name: string;
                        avatar_url: string;
                        bio?: string;
                    }[] = [];
                    if (userIds.length > 0) {
                        const { data: profileData, error: profilesError } = await supabase
                            .from('profiles')
                            .select('id, full_name, avatar_url, bio')
                            .in('id', userIds);
                        if (profilesError)
                            throw profilesError;
                        profiles = profileData ?? [];
                    }
                    const approvedTickets = (ticketRows ?? []).filter(function (ticket) {
                        return ticket.status === 'approved';
                    });
                    const pendingTickets = (ticketRows ?? []).filter(function (ticket) {
                        return ticket.status === 'pending';
                    });
                    return {
                        event,
                        tickets: ticketRows ?? [],
                        approvedTickets,
                        pendingTickets,
                        profiles,
                    };
                },
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/manage-collective',
                element: <ManageCollective />,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/manage-collective/:id',
                element: <ManageCollective />,
                loader: async function ({ params }) {
                    const { id } = params;
                    if (!id) {
                        throw redirect('/collectives');
                    }
                    const { data: { session } } = await supabase.auth.getSession();
                    const userId = session?.user.id;
                    if (!userId) {
                        throw redirect('/login');
                    }
                    const { data: collective, error: collectiveError } = await supabase
                        .from('collectives')
                        .select('*, collective_members (*), collective_followers (*)')
                        .eq('id', id)
                        .single();
                    if (collectiveError)
                        throw collectiveError;
                    if (!collective)
                        throw new Response('Collective not found', { status: 404 });
                    if (collective.owner_id !== userId) {
                        throw redirect(`/collective/${id}`);
                    }
                    const { data: linkedEvents, error: linkedEventsError } = await supabase
                        .from('event_collectives')
                        .select('*')
                        .eq('collective_id', id)
                        .order('created_at', { ascending: false });
                    if (linkedEventsError)
                        throw linkedEventsError;
                    const { data: memberRows, error: memberRowsError } = await supabase
                        .from('collective_members')
                        .select('*')
                        .eq('collective_id', id)
                        .order('created_at', { ascending: false });
                    if (memberRowsError)
                        throw memberRowsError;
                    const memberUserIds = (memberRows ?? []).map(function (member) {
                        return member.user_id;
                    });
                    let memberProfiles: {
                        id: string;
                        full_name: string;
                        avatar_url: string;
                        bio?: string;
                    }[] = [];
                    if (memberUserIds.length > 0) {
                        const { data: profiles, error: profilesError } = await supabase
                            .from('profiles')
                            .select('id, full_name, avatar_url, bio')
                            .in('id', memberUserIds);
                        if (profilesError)
                            throw profilesError;
                        memberProfiles = profiles ?? [];
                    }
                    const eventIds = (linkedEvents ?? []).map(function (row) {
                        return row.event_id;
                    });
                    let events: Event[] = [];
                    if (eventIds.length > 0) {
                        const { data: eventsData, error: eventsError } = await supabase
                            .from('events')
                            .select('*, event_dates(*)')
                            .in('id', eventIds)
                            .order('created_at', { ascending: false });
                        if (eventsError)
                            throw eventsError;
                        events = eventsData ?? [];
                    }
                    const approvedEvents = (linkedEvents ?? [])
                        .filter(function (row) {
                        return row.status === 'approved';
                    })
                        .map(function (row) {
                        return events.find(function (event) {
                            return event.id === row.event_id;
                        });
                    })
                        .filter(function (event): event is Event {
                        return Boolean(event);
                    });
                    const pendingEvents = (linkedEvents ?? [])
                        .filter(function (row) {
                        return row.status === 'pending';
                    })
                        .map(function (row) {
                        return events.find(function (event) {
                            return event.id === row.event_id;
                        });
                    })
                        .filter(function (event): event is Event {
                        return Boolean(event);
                    });
                    const visibleMemberRows = (memberRows ?? []).filter(function (member) {
                        return member.user_id !== collective.owner_id;
                    });
                    const approvedMembers = visibleMemberRows.filter(function (member) {
                        return member.status === 'approved';
                    });
                    const pendingMembers = visibleMemberRows.filter(function (member) {
                        return member.status === 'pending';
                    });
                    return {
                        collective,
                        approvedEvents,
                        pendingEvents,
                        approvedMembers,
                        pendingMembers,
                        memberProfiles,
                        members: visibleMemberRows,
                        followers: collective.collective_followers ?? [],
                    };
                },
                hydrateFallbackElement: <LoadingFallback />
            }
        ]
    },
]);
createRoot(document.getElementById('root')!).render(<StrictMode>
    <AuthContextProvider>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router}/>
      </Suspense>
    </AuthContextProvider>
  </StrictMode>);
