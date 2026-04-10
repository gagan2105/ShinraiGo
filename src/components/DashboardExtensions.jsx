import { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Clock } from 'lucide-react';

export default function DashboardExtensions() {
    const [riskState, setRiskState] = useState({ level: 'Safe', color: 'bg-green-500', text: 'text-green-600', icon: '✅' });
    
    // --- NEW FEATURE: Risk Score System ---
    const checkRiskLevel = (inDangerZone) => {
        const hour = new Date().getHours();
        const isLateNight = hour >= 22 || hour <= 4;
        
        if (inDangerZone || isLateNight) {
            setRiskState({ level: 'High Risk', color: 'bg-rose-500', text: 'text-rose-600', icon: '🚨' });
        } else if (hour >= 18 || hour <= 21) {
            setRiskState({ level: 'Medium Risk', color: 'bg-amber-500', text: 'text-amber-600', icon: '⚠️' });
        } else {
            setRiskState({ level: 'Safe', color: 'bg-emerald-500', text: 'text-emerald-600', icon: '✅' });
        }
    };

    useEffect(() => {
        // Mocking a safe zone for demo purposes
        setTimeout(() => {
            checkRiskLevel(false); 
        }, 0);
    }, []);

    // --- NEW FEATURE: Incident Timeline Data ---
    const timelineEvents = [
        { id: 1, type: "Panic SOS Triggered", time: "10:30 PM", loc: "Mall Road, Darjeeling" },
        { id: 2, type: "Route Deviated", time: "9:15 PM", loc: "Chowrasta" },
        { id: 3, type: "Safe Zone Exited", time: "7:00 PM", loc: "Hotel Elgin" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Risk Score Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-center items-center h-full hover:shadow-md transition-shadow">
               <h3 className="text-lg font-bold text-slate-900 mb-6 self-start">Live Risk Assessment</h3>
               <div className="relative w-36 h-36 flex items-center justify-center bg-slate-50 rounded-full border-[6px] border-slate-100 shadow-inner">
                    <div className={`absolute w-full h-full rounded-full opacity-20 animate-ping ${riskState.color}`}></div>
                    <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center ${riskState.color} text-white shadow-lg z-10`}>
                        <span className="text-3xl mb-1">{riskState.icon}</span>
                        <span className="font-bold text-sm tracking-wide">{riskState.level}</span>
                    </div>
               </div>
               <p className="mt-8 text-sm text-center text-slate-500 px-4">
                   Risk is calculated dynamically based on real-time zone alerts and current time metrics.
               </p>
            </div>

            {/* Vertical Incident Timeline Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Incident Timeline</h3>
                <div className="relative border-l-2 border-slate-100 ml-3 md:ml-4 space-y-6">
                    {timelineEvents.map((event, index) => (
                        <div key={event.id} className="relative pl-6">
                            {/* Timeline Node */}
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-[3px] border-white bg-brand-500 shadow-sm"></div>
                            
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-slate-800 flex items-center group-hover:text-brand-600 transition-colors">
                                    {index === 0 && <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />}
                                    {event.type}
                                </h4>
                                <div className="flex items-center text-xs text-slate-500 mt-2 space-x-4">
                                    <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md"><Clock className="w-3 h-3 mr-1.5 text-slate-400" /> {event.time}</span>
                                    <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md"><MapPin className="w-3 h-3 mr-1.5 text-slate-400" /> {event.loc}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
