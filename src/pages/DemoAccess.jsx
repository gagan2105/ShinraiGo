import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const DemoAccess = () => {
    const { setManualUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        
        if (mounted) {
            setManualUser({
                uid: 'demo-admin-uid',
                email: 'nexus@shinraigo.admin',
                displayName: 'Demo Commander',
                isDummy: true
            }, 'admin');

            setTimeout(() => {
                if (mounted) navigate("/admin/police-cmd");
            }, 500);
        }

        return () => { mounted = false; };
    }, []); // Run only once on mount

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <LoadingSpinner text="Initializing Demo Sequence..." />
        </div>
    );
};

export default DemoAccess;
