import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export function ProtectedRoute() {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
