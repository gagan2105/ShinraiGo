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

    // Secondary Check: If role sync hasn't happened yet but we have the email
    const email = currentUser.email?.toLowerCase();
    const isAdmin = ['nexus3340@gmail.com', 'nexus@shinraigo.admin'].includes(email);
    const isPolice = ['officer@shinraigo.police', '24211a05p3@bvrit.ac.in'].includes(email);

    if (userRole === "admin" || userRole === "police" || isAdmin || isPolice) {
        return <Navigate to="/admin/police-cmd" replace />;
    }

    // Default for 'user'
    return <Navigate to="/user/home" replace />;
};

export default AuthGateway;
