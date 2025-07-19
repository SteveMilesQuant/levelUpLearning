// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useUser } from '../users';
import useAlert from '../hooks/useAlerts';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole: string;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
    const { data: user, isLoading } = useUser();
    const { setAlert } = useAlert();
    const location = useLocation();

    if (isLoading) return null; // or a loading spinner using Chakra UI

    if (!user || !user?.roles.includes(allowedRole)) {
        setAlert({
            status: "error",
            message: `Your login doesn't have permission to access ${location.pathname}.`,
        });
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}