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

          const { data, error } = await supabase
            .from('events')
            .select('*, event_dates(*)')
            .eq('id', id)
            .single();

          if (error) throw error;

          const { data: tickets, error: ticketsError } = await supabase
            .from('tickets')
            .select('*')
            .eq('event_id', id)
            .eq('status', 'approved')

          if (ticketsError) throw ticketsError;

          const { data: collective, error: collectiveError } = await supabase
            .from('event_collectives')
            .select('collective_id')
            .eq('event_id', id)
            .single();

          if (collectiveError) throw collectiveError;
          if (!data) throw new Response('Event not found', { status: 404 });

          return { event: data, tickets: tickets, collective: collective };
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
