import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * A wrapper for routes that requires authentication and optionally a specific role.
 * @param {string[]} allowedRoles - An array of roles allowed to access this route. e.g. ["admin", "police"]
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { currentUser, userRole, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-slate-400 animate-pulse">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!currentUser) {
        // Redirect to login page and save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If a specific role is required and user doesn't have it
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect somewhere safe if they try to access unauthorized pages
        // We navigate back to root, or maybe a dedicated unauthorized page
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
