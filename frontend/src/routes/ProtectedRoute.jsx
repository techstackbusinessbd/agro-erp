import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

export default function ProtectedRoute({ permission }) {
    const { user, loading, hasPermission } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If permission is required but user doesn't have it
    if (permission && !hasPermission(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
