import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { ENDPOINTS } from "../lib/api";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isOnboarded, setIsOnboarded] = useState(true); // Default to true to prevent flickering
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            if (user) {
                setCurrentUser(user); // Set immediately to unlock UI
                try {
                    const idToken = await user.getIdToken(true);
                    const response = await axios.post(ENDPOINTS.SYNC, {
                        name: user.displayName || user.email?.split('@')[0]
                    }, {
                        headers: { Authorization: `Bearer ${idToken}` },
                        timeout: 10000
                    });

                    if (response.data && response.data.user) {
                        setUserRole(response.data.user.role);
                        setIsOnboarded(response.data.user.isOnboarded);
                    } else {
                        setUserRole("user");
                        setIsOnboarded(false);
                    }
                } catch (error) {
                    console.error("Backend Auth Sync Error:", error);
                    const email = user.email?.toLowerCase();
                    if (email === 'nexus3340@gmail.com' || email === 'nexus@shinraigo.admin') {
                        setUserRole("admin");
                        setIsOnboarded(true);
                    } else if (email === 'officer@shinraigo.police' || email === '24211a05p3@bvrit.ac.in') {
                        setUserRole("police");
                        setIsOnboarded(true);
                    } else {
                        setUserRole("user");
                        setIsOnboarded(false);
                    }
                }
            } else {
                // IMPORTANT: Don't overwrite if it was a manual dummy login
                setCurrentUser(prevUser => {
                    if (prevUser && prevUser.isDummy) return prevUser;
                    setUserRole(null);
                    return null;
                });
            }

            setLoading(false);
        });

        // Cleanup subscription
        return unsubscribe;
    }, []);

    const setManualUser = useCallback((user, role) => {
        setCurrentUser({ ...user, isDummy: true });
        setUserRole(role);
        setLoading(false);
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        await signOut(auth);
        setCurrentUser(null);
        setUserRole(null);
        setLoading(false);
    }, []);

    const value = {
        currentUser,
        userRole,
        isOnboarded,
        setIsOnboarded,
        loading,
        setManualUser,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Show nothing until initial auth state is resolved to prevent flashing unauth screens */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
