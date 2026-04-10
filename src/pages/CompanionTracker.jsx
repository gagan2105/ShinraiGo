import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BellRing, ShieldCheck, User } from "lucide-react";
import MapComponent from "../components/MapComponent";

export default function CompanionTracker() {
    const { userId } = useParams();
    const [touristLocation, setTouristLocation] = useState(null);

    useEffect(() => {
        // DEMO: Simulate fetching user's live position from Firestore
        const fetchLocation = () => {
            setTouristLocation({
                user: "John Doe",
                type: "Live Location Broadcast",
                lat: 27.0410,
                lng: 88.2663
            });
        };
        fetchLocation();

        // Simulate moving for the demo
        const interval = setInterval(() => {
            setTouristLocation(prev => ({
                ...prev,
                lat: prev.lat + 0.0001,
                lng: prev.lng + 0.0001
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, [userId]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center items-center">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row h-[85vh]">
                
                {/* Sidebar Info */}
                <div className="w-full md:w-1/3 bg-slate-900 text-white p-6 md:p-8 flex flex-col">
                    <div className="flex flex-col items-center mb-8 border-b border-slate-700 pb-6">
                        <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center mb-4">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">John Doe</h2>
                        <p className="text-slate-400 text-xs">Companion ID: {userId}</p>
                    </div>

                    <div className="space-y-6 flex-1">
                         <div className="bg-slate-800 rounded-xl p-4 flex items-start space-x-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold">Status: Verified Safe</h4>
                                <p className="text-xs text-slate-400 mt-1">Movement is normal. Not in any restricted zones.</p>
                            </div>
                         </div>
                         
                         <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 cursor-pointer hover:bg-rose-500/20 transition">
                             <div className="flex items-center text-rose-400 font-bold mb-1">
                                 <BellRing className="w-4 h-4 mr-2" /> Request Check-In
                             </div>
                             <p className="text-xs text-rose-200">Send an immediate ping asking John to confirm their safety.</p>
                         </div>
                    </div>
                </div>

                {/* Map Display */}
                <div className="w-full md:w-2/3 h-96 md:h-full relative bg-slate-100 p-2">
                    {touristLocation ? (
                        <div className="h-full rounded-3xl overflow-hidden">
                            <MapComponent selectedIncident={touristLocation} />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">Loading GPS Signal...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
