import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Acts as the default root page ("/").
 * Pushes users to specific group urls based on authoritative role.
 */
const AuthGateway = () => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner text="Checking authentication state..." />
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (userRole === "admin" || userRole === "police") {
        return <Navigate to="/admin/police-cmd" replace />;
    }

    // Default for 'user'
    return <Navigate to="/user/home" replace />;
};

export default AuthGateway;
