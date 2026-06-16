import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthContextProvider from './context/AuthContext'
import './index.css'
import App from './App.tsx'
import { supabase } from './api/SupabaseClient'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: async () => {
          const { data: featuredEvents, error } = await supabase
            .from('featured_events')
            .select('*')

          if (error) throw error

          const { data: allEvents, error: allEventsError } = await supabase
            .from('events')
            .select('*')

          if (allEventsError) throw allEventsError
          return { featuredEvents, allEvents }
        }
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
])



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode >,
)
