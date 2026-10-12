// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontWeight: '600', color: 'var(--agri-primary)' }}>Validating secure session credentials...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const hasPermission = allowedRoles ? allowedRoles.includes(user.role) : true;

    if (!hasPermission) {
        // Redirect user to their default role dashboard if they lack permission for this route
        const fallbackPath = user.role === 'farmer' ? '/farmer' : user.role === 'officer' ? '/officer' : '/ministry';
        return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
}

export function PublicOnlyRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user) {
        const dest = user.role === 'farmer' ? '/farmer' : user.role === 'officer' ? '/officer' : '/ministry';
        return <Navigate to={dest} replace />;
    }

    return children;
}

export default ProtectedRoute;