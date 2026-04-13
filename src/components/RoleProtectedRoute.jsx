import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const RoleProtectedRoute = ({ allowedRoles = [] }) => {
    const { currentUser, userRole, isOnboarded, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner text="Checking permissions..." />;
    }

    // 1. Not Authenticated
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // 2. Authenticated but missing the required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect standard users who try to access admin pages
        if (userRole === "user") {
            return <Navigate to="/user/home" replace />;
        }
        // Redirect admins trying to access user-only pages
        if (userRole === "admin" || userRole === "police") {
            return <Navigate to="/admin/police-cmd" replace />;
        }
        // Ultimate fallback
        return <Navigate to="/" replace />;
    }

    // 3. User is authorized but has not completed onboarding
    if (userRole === "user" && !isOnboarded) {
        // Prevent infinite loops if they're already headed to onboarding
        // But the router handles this because onboarding isn't inside RoleProtectedRoute
        return <Navigate to="/onboarding" replace />;
    }

    // 4. Authenticated and Authorized
    return <Outlet />;
};

export default RoleProtectedRoute;
