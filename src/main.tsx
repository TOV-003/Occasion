import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import AuthContextProvider from './context/AuthContext'
import './index.css'
import App from './App.tsx'
import { supabase } from './api/SupabaseClient'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About.tsx'
import EventPage from './pages/EventPage'
import ErrorPage from './components/ErrorPage'
import LoadingFallback from './components/LoadingFallback'
import CollectivePage from './pages/CollectivePage.tsx'
import Settings from './pages/Settings.tsx'
import Dashboard from './pages/Dashboard'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: async () => {
          const today = new Date().toLocaleDateString('en-CA');

          const [
            featuredEventsResult,
            allEventsResult,
            eventDatesResult,
            ticketsResult,
            collectivesResult
          ] = await Promise.all([
            supabase.from('featured_events').select('*'),
            supabase
              .from('events')
              .select('*, event_dates!inner(date)')
              .gte('event_dates.date', today),
            supabase
              .from('event_dates')
              .select('*')
              .gte('date', today),
            supabase.from('tickets').select('*'),
            supabase.from('collectives').select(`*,collective_members (*),collective_followers (*)`)
          ]);

          if (featuredEventsResult.error) throw featuredEventsResult.error;
          if (allEventsResult.error) throw allEventsResult.error;
          if (eventDatesResult.error) throw eventDatesResult.error;
          if (ticketsResult.error) throw ticketsResult.error;
          if (collectivesResult.error) throw collectivesResult.error;

          return {
            featuredEvents: featuredEventsResult.data,
            allEvents: allEventsResult.data,
            eventDates: eventDatesResult.data,
            tickets: ticketsResult.data,
            collectives: collectivesResult.data
          };
        }
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
        loader: async ({ params }) => {
          const { id } = params;
          if (!id) throw new Error('Event ID required');

          const [eventResult, ticketsResult, collectiveLinkResult] = await Promise.all([
            supabase.from('events').select('*, event_dates(*)').eq('id', id).single(),
            supabase.from('tickets').select('*').eq('event_id', id).eq('status', 'approved'),
            supabase.from('event_collectives').select('collective_id').eq('event_id', id).maybeSingle()
          ]);

          if (eventResult.error) throw eventResult.error;
          if (!eventResult.data) throw new Response('Event not found', { status: 404 });
          if (ticketsResult.error) throw ticketsResult.error;
          if (collectiveLinkResult.error) throw collectiveLinkResult.error;

          let eventCollective = null;
          const collectiveLink = collectiveLinkResult.data;

          if (collectiveLink) {
            const { data: collective, error: collectiveError } = await supabase
              .from('collectives')
              .select(`*, collective_members (*), collective_followers (*)`)
              .eq('id', collectiveLink.collective_id)
              .single();

            if (collectiveError) throw collectiveError;
            eventCollective = collective;
          }

          return {
            event: eventResult.data,
            tickets: ticketsResult.data,
            eventCollective
          };
        }
      },
      {
        path: '/collective/:id',
        element: <CollectivePage />,
        loader: async ({ params }) => {
          const { id } = params;
          if (!id) throw new Error('Collective ID required');

          const today = new Date().toLocaleDateString('en-CA');

          const [
            collectiveResult,
            collectiveMembersResult,
            collectiveFollowersResult,
            collectiveEventsResult,
          ] = await Promise.all([
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
              .eq('status', 'approved')
          ]);

          if (collectiveResult.error) throw collectiveResult.error;
          if (collectiveMembersResult.error) throw collectiveMembersResult.error;
          if (collectiveFollowersResult.error) throw collectiveFollowersResult.error;
          if (collectiveEventsResult.error) throw collectiveEventsResult.error;

          const userIds = collectiveMembersResult.data?.map(m => m.user_id) || [];
          let memberProfiles: { id: string; full_name: string; avatar_url: string; bio?: string }[] = [];
          if (userIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, bio')
              .in('id', userIds);
            if (!profilesError) {
              memberProfiles = profiles || [];
            } else {
              console.warn('Failed to fetch member profiles:', profilesError);
            }
          }

          const eventIds = collectiveEventsResult.data?.map(ec => ec.event_id) || [];

          let events = [];
          let tickets = [];

          if (eventIds.length > 0) {
            const { data: eventsData, error: eventsError } = await supabase
              .from('events')
              .select('*, event_dates(*)')
              .in('id', eventIds)
              .gte('event_dates.date', today);

            if (eventsError) throw eventsError;
            events = eventsData || [];

            const { data: ticketsData, error: ticketsError } = await supabase
              .from('tickets')
              .select('*')
              .in('event_id', eventIds)
              .eq('status', 'approved');

            if (ticketsError) throw ticketsError;
            tickets = ticketsData || [];
          }

          return {
            collective: collectiveResult.data,
            collectiveMembers: collectiveMembersResult.data,
            collectiveFollowers: collectiveFollowersResult.data,
            events,
            tickets,
            memberProfiles
          };
        }
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
        loader: async () => {
          const { data: { session } } = await supabase.auth.getSession();

          const userId = session?.user.id;

          const { data: Profile, error: ProfileError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, bio')
            .eq('id', userId)
            .single()

          if (ProfileError) throw ProfileError;

          return {
            Profile: Profile
          };
        }
      }
    ]
  },
])



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthContextProvider>
  </StrictMode >,
)
