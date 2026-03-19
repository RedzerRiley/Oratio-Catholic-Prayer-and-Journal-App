import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}