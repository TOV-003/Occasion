import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import AuthContextProvider from './context/AuthContext';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ErrorPage from './components/ErrorPage';
import LoadingFallback from './components/LoadingFallback';
const About = lazy(function () {
    return import('./pages/About.tsx');
});
const EventPage = lazy(function () {
    return import('./pages/EventPage');
});
const CollectivePage = lazy(function () {
    return import('./pages/CollectivePage.tsx');
});
const Profile = lazy(function () {
    return import('./pages/Profile');
});
const Settings = lazy(function () {
    return import('./pages/Settings.tsx');
});
const Dashboard = lazy(function () {
    return import('./pages/Dashboard');
});
const Bookmarks = lazy(function () {
    return import('./pages/Bookmarks');
});
const Collectives = lazy(function () {
    return import('./pages/Collectives');
});
const NewEvent = lazy(function () {
    return import('./pages/NewEvent');
});
const NewCollective = lazy(function () {
    return import('./pages/NewCollective');
});
const ManageCollective = lazy(function () {
    return import('./pages/ManageCollective');
});
const ManageEvent = lazy(function () {
    return import('./pages/ManageEvent');
});
import {
    bookmarksLoader,
    collectiveLoader,
    dashboardLoader,
    eventLoader,
    homeLoader,
    manageCollectiveLoader,
    manageEventLoader,
    profileLoader,
} from './loaders';
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
                loader: homeLoader,
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
                loader: eventLoader,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/collective/:id',
                element: <CollectivePage />,
                loader: collectiveLoader,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/profile/:id',
                element: <Profile />,
                loader: profileLoader,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/bookmarks',
                element: <Bookmarks />,
                loader: bookmarksLoader,
                hydrateFallbackElement: <LoadingFallback />
            },
            {
                path: '/settings',
                element: <Settings />,
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
                loader: dashboardLoader,
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
                path: '/manage-event/:id',
                element: <ManageEvent />,
                loader: manageEventLoader,
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
                loader: manageCollectiveLoader,
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
