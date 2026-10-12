// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HOME = {
  farmer: '/farmer',
  officer: '/fra', fra_officer: '/officer', admin: '/officer',
  ministry: '/ministry', finance: '/ministry',
};

export const normalizeRole = (r) => String(r ?? '').toLowerCase().replace(/^role_/, '');
export const homeFor = (r) => HOME[normalizeRole(r)] ?? null;

export function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const role = normalizeRole(user.role);
  if (allowedRoles && !allowedRoles.includes(role)) {
    const home = HOME[role];
    if (!home || location.pathname.startsWith(home)) {
      return <div role="alert" style={{ padding: 32 }}>403: your role cannot access this area.</div>;
    }
    return <Navigate to={home} replace />;
  }
  return <Outlet />;
}

export function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  const home = user && homeFor(user.role);
  return home ? <Navigate to={home} replace /> : children;
}

export default ProtectedRoute;