import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import DailyPrayers from './pages/DailyPrayers';
import Rosary from './pages/Rosary';
import Novenas from './pages/Novenas';
import Confessions from './pages/Confessions';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Profile from './pages/Profile.tsx';


export const router = createBrowserRouter([

  {
  path: '/profile',
  element: <ProtectedRoute><Profile /></ProtectedRoute>,
},
  {
    path: '/auth',
    Component: Auth,
  },
  {
    path: '/',
    element: <ProtectedRoute><Home /></ProtectedRoute>,
    ErrorBoundary: NotFound,
  },
  {
    path: '/daily-prayers',
    element: <ProtectedRoute><DailyPrayers /></ProtectedRoute>,
    ErrorBoundary: NotFound,
  },
  {
    path: '/rosary',
    element: <ProtectedRoute><Rosary /></ProtectedRoute>,
    ErrorBoundary: NotFound,
  },
  {
    path: '/novenas',
    element: <ProtectedRoute><Novenas /></ProtectedRoute>,
    ErrorBoundary: NotFound,
  },
  {
    path: '/confessions',
    element: <ProtectedRoute><Confessions /></ProtectedRoute>,
    ErrorBoundary: NotFound,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);