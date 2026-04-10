import { useState, useEffect } from "react";
import { Shield, MapPin, Bell, AlertTriangle, FileText, CheckCircle, Search, User, Phone, Map, Crosshair, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import MapComponent from "../components/MapComponent";
import { ENDPOINTS } from "../lib/api";

export default function PoliceDashboard() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [feed, setFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch live feed initially
        const fetchFeed = async () => {
            try {
                const response = await fetch(ENDPOINTS.LIVE_FEED);
                const data = await response.json();
                setFeed(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch live feed", error);
                toast.error("Lost connection to Command Server");
                setIsLoading(false);
            }
        };

        fetchFeed();

        // Setup polling every 3 seconds to simulate "Live" connection
        const interval = setInterval(fetchFeed, 3000);
        return () => clearInterval(interval);
    }, []);

    const getIconForType = (type) => {
        switch (type) {
            case 'panic': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
            case 'efir': return <FileText className="w-5 h-5 text-amber-500" />;
            case 'approval': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'anomaly': return <MapPin className="w-5 h-5 text-indigo-500" />;
            default: return <Bell className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBgForType = (type) => {
        switch (type) {
            case 'panic': return 'bg-rose-50 border-rose-100 hover:bg-rose-100/50';
            case 'efir': return 'bg-amber-50 border-amber-100 hover:bg-amber-100/50';
            case 'approval': return 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50';
            case 'anomaly': return 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50';
            default: return 'bg-blue-50 border-blue-100 hover:bg-blue-100/50';
        }
    };

    const handleFeedClick = (item) => {
        setSelectedUser(item);
        toast(`Acquiring satellite lock on ${item.user}...`);
    };

    return (
        <div className="h-[calc(100vh-80px)] flex space-x-4 animate-in fade-in duration-500">

            {/* LEFT: User/Incident Details Panel */}
            <div className="w-1/4 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center"><Search className="w-4 h-4 mr-2 text-slate-400" /> Dossier</h2>
                </div>

                <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div
                                key={selectedUser.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-6"
                            >
                                <div className="text-center pb-4 border-b border-slate-100">
                                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 shadow-md border-2 ${selectedUser.type === 'panic' ? 'bg-rose-100 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                                        <User className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedUser.user}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 ${selectedUser.type === 'panic' ? 'bg-rose-100 text-rose-700' :
                                        selectedUser.type === 'efir' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                        {selectedUser.title}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Known Location</label>
                                        <p className="text-sm font-semibold text-slate-800 flex items-center mt-1"><MapPin className="w-4 h-4 mr-1 text-slate-400" /> {selectedUser.location}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ID Number</label>
                                            <p className="text-sm font-semibold text-slate-800 mt-1">{selectedUser.idNumber}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Blood Type</label>
                                            <p className="text-sm font-semibold text-rose-600 mt-1">{selectedUser.bloodGroup}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact Number</label>
                                            <p className="text-sm font-semibold text-slate-800 flex items-center mt-1"><Phone className="w-4 h-4 mr-1 text-slate-400" /> {selectedUser.phone}</p>
                                        </div>
                                        {selectedUser.type === 'panic' && (
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center">
                                                    <Shield className="w-3 h-3 mr-1" /> AI Threat Score
                                                </label>
                                                <div className="flex items-center mt-1">
                                                    <div className="w-full bg-slate-200 rounded-full h-2 mr-2 relative overflow-hidden">
                                                        <div 
                                                            className={`h-2 rounded-full ${selectedUser.threatConfidence > 80 ? 'bg-rose-500 animate-pulse' : selectedUser.threatConfidence > 40 ? 'bg-amber-500' : 'bg-slate-500'}`} 
                                                            style={{ width: `${selectedUser.threatConfidence || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-black ${selectedUser.threatConfidence > 80 ? 'text-rose-600' : 'text-slate-700'}`}>
                                                        {selectedUser.threatConfidence || 0}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2 border-t border-slate-100">
                                    <button
                                        onClick={() => toast.success("Commencing voice protocol with tourist device.")}
                                        className="w-full bg-slate-900 text-white font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors">
                                        <Phone className="w-4 h-4 mr-2" /> Connect Immediately
                                    </button>
                                    <button
                                        onClick={() => toast.info("Dispatching Rapid Response Force.")}
                                        className="w-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                                        <Shield className="w-4 h-4 mr-2" /> Dispatch RRF Unit
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 pb-12">
                                <Search className="w-12 h-12 opacity-20" />
                                <div className="text-center">
                                    <p className="text-sm">Select an incident from the feed.</p>
                                    <p className="text-[10px] mt-1 opacity-60">Waiting for live data...</p>
                                </div>
                                
                                <div className="pt-8 w-full px-4">
                                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 text-center">
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Developer Tools</p>
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    const dummyData = {
                                                        user: "Mock Tourist " + Math.floor(Math.random() * 1000),
                                                        location: "Sector " + (Math.floor(Math.random() * 20)+1) + ", New Delhi",
                                                        idNumber: "AADHAAR-" + Math.floor(Math.random() * 1000000000),
                                                        phone: "+91 98765 43" + Math.floor(Math.random() * 999),
                                                        bloodGroup: ["A+", "B+", "O+", "AB+"][Math.floor(Math.random() * 4)]
                                                    };
                                                    await fetch(ENDPOINTS.PANIC_ALERT, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(dummyData)
                                                    });
                                                    toast.success("Dummy SOS alert broadcasted!");
                                                } catch (e) {
                                                    toast.error("Failed to simulate alert. Check backend.");
                                                }
                                            }}
                                            className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                        >
                                            <AlertTriangle className="w-3 h-3" />
                                            Simulate SOS Alert
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* MIDDLE: Live Tracking Map */}
            <div className="flex-1 bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative flex flex-col border border-slate-800">
                <div className="absolute top-4 left-4 z-20 bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white px-4 py-2 rounded-xl flex items-center shadow-lg">
                    <Crosshair className="w-4 h-4 mr-2 text-emerald-400 animate-pulse" />
                    <span className="text-sm font-semibold">Live Geo-Spatial Tracking Node</span>
                </div>

                <div className="absolute bottom-4 left-4 z-20 bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-300 p-3 rounded-xl shadow-lg w-64 pointer-events-none">
                    <h4 className="text-xs font-bold tracking-wider uppercase mb-2 text-slate-400">Map Legend</h4>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span> Active Patrols</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-brand-500 mr-2 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span> Normal Tourists</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-rose-500 mr-2 animate-ping shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span> Critical Incident</div>
                    </div>
                </div>

                {/* Map Interface Area */}
                <div className="flex-1 relative w-full h-full z-10">
                    <MapComponent selectedIncident={selectedUser} />
                    
                    {/* Satellite Overlay Effect when user is selected */}
                    <AnimatePresence>
                        {selectedUser && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
                            >
                                {/* Digital Grid */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                
                                {/* Scanning Line */}
                                <motion.div 
                                    initial={{ top: '-10%' }}
                                    animate={{ top: '110%' }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                    className="absolute left-0 right-0 h-1 bg-brand-500/30 shadow-[0_0_15px_rgba(99,102,241,0.5)] blur-[1px]"
                                />
                                
                                {/* Corner Data Widgets */}
                                <div className="absolute top-20 right-4 space-y-2 text-right">
                                    <div className="bg-slate-900/90 border border-slate-700/50 p-2 rounded-lg backdrop-blur-md">
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Signal Latency</p>
                                        <p className="text-xs font-black text-emerald-400 font-mono">24ms</p>
                                    </div>
                                    <div className="bg-slate-900/90 border border-slate-700/50 p-2 rounded-lg backdrop-blur-md">
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Enc. Strength</p>
                                        <p className="text-xs font-black text-blue-400 font-mono">92%</p>
                                    </div>
                                    <div className="bg-rose-900/90 border border-rose-700/50 p-2 rounded-lg backdrop-blur-md animate-pulse">
                                        <p className="text-[8px] font-bold text-rose-300 uppercase tracking-widest">Tracking Lock</p>
                                        <p className="text-xs font-black text-rose-100 font-mono">VERIFIED</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT: Live Incident Feed */}
            <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center"><Bell className="w-4 h-4 mr-2" /> Live Intel Feed</h2>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                    {feed.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleFeedClick(item)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedUser?.id === item.id ? 'ring-2 ring-brand-500 shadow-md ' + getBgForType(item.type) : getBgForType(item.type)
                                }`}
                        >
                            <div className="flex items-start">
                                <div className="mr-3 mt-0.5 relative">
                                    {getIconForType(item.type)}
                                    {item.type === 'panic' && (
                                        <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs font-medium text-slate-600 truncate">{item.user}</p>
                                        <span className="text-[10px] text-slate-500 flex items-center whitespace-nowrap ml-2"><Clock className="w-3 h-3 mr-0.5" /> {item.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center truncate"><MapPin className="w-3 h-3 mr-1" /> {item.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">End of recent intel</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
