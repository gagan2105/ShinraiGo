import { createContext, useContext, useEffect, useState } from "react";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            if (user) {
                try {
                    // 1. Get the Firebase ID token for this session
                    const idToken = await user.getIdToken(true);

                    // 2. Send token to our Node Backend to sync user/fetch MongoDB role
                    // Note: We send displayName explicitly since it might not be decoded from token immediately upon signup
                    const response = await axios.post(ENDPOINTS.SYNC, {
                        name: user.displayName || user.email?.split('@')[0]
                    }, {
                        headers: {
                            Authorization: `Bearer ${idToken}`
                        }
                    });

                    // 3. Set authoritative role based on backend MongoDB response
                    if (response.data && response.data.user) {
                        setUserRole(response.data.user.role);
                    } else {
                        setUserRole("user"); // fallback
                    }

                    setCurrentUser(user);

                } catch (error) {
                    console.error("Backend Auth Sync Error:", error);
                    // Decide if you want to log them out or fallback to basic user
                    // For security, if we can't verify with backend, we should probably sign them out:
                    // auth.signOut();

                    setUserRole(null);
                    setCurrentUser(null);
                }
            } else {
                // IMPORTANT: Don't overwrite if it was a manual dummy login
                // We should only clear it if we weren't in a manually started session
                setCurrentUser(prevUser => {
                    // Check if it's a real Firebase user by availability of functions like getIdToken
                    if (prevUser && prevUser.isDummy) {
                        return prevUser;
                    }
                    setUserRole(null);
                    return null;
                });
            }

            setLoading(false);
        });

        // Cleanup subscription
        return unsubscribe;
    }, []);

    const setManualUser = (user, role) => {
        setCurrentUser({ ...user, isDummy: true });
        setUserRole(role);
        setLoading(false);
    };

    const logout = async () => {
        setLoading(true);
        await signOut(auth);
        setCurrentUser(null);
        setUserRole(null);
        setLoading(false);
    };

    const value = {
        currentUser,
        userRole,
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
