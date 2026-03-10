import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export function ProtectedRoute() {
  const { token } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
