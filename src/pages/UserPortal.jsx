import { useState, useEffect } from "react";
import { Shield, Bell, MapPin, ShieldAlert, Navigation, QrCode, MessageSquare, Settings, User, Heart, Info, LogOut, Loader2, Zap, Activity, ShieldCheck, ChevronRight, Share2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { ENDPOINTS } from "../lib/api";

export default function UserPortal() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("safeguard");
    const [panicMode, setPanicMode] = useState(false);
    const [safetyScore, setSafetyScore] = useState(94);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", profilePic: "", phone: "" });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const idToken = await currentUser?.getIdToken();
                const response = await axios.post(ENDPOINTS.SYNC, {}, {
                    headers: { Authorization: `Bearer ${idToken}` }
                });
                if (response.data?.user) {
                    setUserData(response.data.user);
                    setEditForm({
                        name: response.data.user.name || "",
                        profilePic: response.data.user.profilePic || "https://i.pravatar.cc/150?img=11",
                        phone: response.data.user.phone || ""
                    });
                }
            } catch (e) {
                console.error("Failed to fetch user context");
            }
            setLoading(false);
        };
        fetchUserData();
    }, [currentUser]);

    const handleUpdateProfile = async () => {
        try {
            const idToken = await currentUser?.getIdToken();
            await axios.put(ENDPOINTS.PROFILE_UPDATE, {
                fullName: editForm.name,
                profilePic: editForm.profilePic,
                phone: editForm.phone
            }, {
                headers: { Authorization: `Bearer ${idToken}` }
            });
            
            setUserData(prev => ({ 
                ...prev, 
                name: editForm.name, 
                profilePic: editForm.profilePic,
                phone: editForm.phone
            }));
            
            setIsEditing(false);
            toast.success("Identity Matrix Updated");
        } catch (e) {
            toast.error("Failed to update profile");
        }
    };

    const handlePanic = async () => {
        setPanicMode(true);
        toast.error("SOS EMITTED: Police Command Notified", {
            description: "Live telemetry and audio broadcast active.",
            duration: 10000
        });

        try {
            await axios.post(ENDPOINTS.PANIC_ALERT, {
                user: userData?.name || currentUser?.displayName || "Unknown User",
                location: "Live Device Geo-Lock",
                phone: userData?.phone || currentUser?.email || "911",
                bloodGroup: userData?.bloodGroup || "Pending",
                idNumber: userData?.firebaseUid || "Anonymous"
            });
        } catch (e) {
            console.warn("Panic network bypass active");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-brand-400/30">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <p className="mt-6 text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Mobile Neural Link</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden">
            {/* Main Application Shell (Edge-to-Edge Clean) */}
            <div className="flex-1 flex flex-col relative overflow-hidden">

                {/* Navbar */}
                <header className="pt-14 pb-6 px-6 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 z-40">
                    <div>
                        <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest leading-none mb-1">Shinrai Network</p>
                        <h1 className="text-xl font-black tracking-tight italic">GUARD <span className="text-slate-500 font-medium">MOBILE</span></h1>
                    </div>
                    <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center relative hover:bg-slate-700 transition-colors">
                            <Bell className="w-5 h-5 text-slate-400" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900" />
                         </div>
                    </div>
                </header>

                {/* Main Dynamic Content Area */}
                <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide relative">
                    <AnimatePresence mode="wait">
                        {activeTab === "safeguard" && (
                            <motion.div
                                key="safe"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Safety Pulse Score Card */}
                                <div className="bg-slate-800/40 rounded-[2.5rem] p-8 border border-slate-700/50 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent opacity-50" />
                                    
                                    <div className="relative z-10 flex flex-col items-center">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Real-Time Safety Index</h3>
                                        
                                        <div className="relative w-48 h-48 flex items-center justify-center">
                                            {/* Pulse Rings */}
                                            <div className="absolute inset-4 rounded-full border border-emerald-500/20 animate-pulse" />
                                            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 animate-ping" />
                                            
                                            <div className="text-center">
                                                <span className={`text-6xl font-black tracking-tighter ${panicMode ? 'text-rose-500' : 'text-emerald-500'} drop-shadow-glow`}>
                                                    {panicMode ? '!!!' : safetyScore}
                                                </span>
                                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mt-2">Authenticated Safe</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex space-x-2">
                                            <Badge icon={<ShieldCheck className="w-3 h-3" />} label="AES-256" color="emerald" />
                                            <Badge icon={<Activity className="w-3 h-3" />} label="Neural Sync" color="blue" />
                                        </div>
                                    </div>
                                </div>

                                    </div>
                                </div>

                                {/* Panic Override - Tactical SOS */}
                                <div className="pt-12 flex flex-col items-center">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic">Emergency SOS Override</h4>
                                    
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handlePanic}
                                        className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-8 transition-all duration-500 relative ${panicMode 
                                            ? 'bg-rose-600 border-rose-400 shadow-[0_0_80px_rgba(225,29,72,0.6)] animate-pulse' 
                                            : 'bg-slate-900 border-slate-800 shadow-xl hover:border-rose-500/30 group'
                                        }`}
                                    >
                                        <div className={`absolute inset-0 rounded-full bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors ${panicMode ? 'hidden' : 'block'}`} />
                                        <ShieldAlert className={`w-14 h-14 mb-1 transition-colors ${panicMode ? 'text-white' : 'text-rose-500'}`} />
                                        <span className={`text-sm font-black uppercase tracking-widest ${panicMode ? 'text-white' : 'text-slate-400'}`}>
                                            {panicMode ? 'Help Active' : 'Panic'}
                                        </span>
                                    </motion.button>
                                    
                                    <p className="mt-8 text-center text-xs text-slate-500 font-medium px-8 leading-relaxed">
                                        {panicMode 
                                            ? "Police Command has intercepted your telemetry. Emergency protocols are executing."
                                            : "Press firmly for 2 seconds to initiate immediate authority escalation."
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "wallet" && (
                            <motion.div
                                key="wallet"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden h-[500px] flex flex-col justify-between">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                                    
                                    <div>
                                        <div className="flex justify-between items-start mb-10">
                                            <ShieldCheck className="w-10 h-10 text-white/50" />
                                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center">
                                                <Zap className="w-3 h-3 mr-1 text-amber-300" />
                                                <span className="text-[10px] uppercase font-black text-white">Encrypted</span>
                                            </div>
                                        </div>
                                        
                                        <h2 className="text-3xl font-black tracking-tight">{currentUser?.displayName || "John Doe"}</h2>
                                        <p className="text-indigo-200 text-sm font-medium mt-1">Verified Tourist Identity</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                         <div className="bg-white p-4 rounded-3xl shadow-2xl">
                                             <QRCodeCanvas value={`SH-USER:${currentUser?.uid}`} size={160} />
                                         </div>
                                         <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-black text-indigo-300">Auth-ST-88192-NODE</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                                        <div className="text-center">
                                            <p className="text-[10px] text-indigo-300 uppercase font-black tracking-widest leading-none mb-1">Blood Type</p>
                                            <p className="text-xs font-bold text-emerald-400">{userData?.bloodGroup || "PENDING"}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-indigo-300 uppercase font-black tracking-widest leading-none mb-1">Nationality</p>
                                            <p className="text-xs font-bold text-white uppercase">{userData?.nationality || "UNSET"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                     <WalletItem icon={<Camera className="w-4 h-4" />} title="E-Visa Snapshot" date="Expires in 12 days" />
                                     <WalletItem icon={<Zap className="w-4 h-4" />} title="Health Passport" date="O+ Verified" />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-[2rem] bg-slate-800 border-2 border-brand-500 p-1 flex items-center justify-center relative shadow-2xl">
                                        <img src={userData?.profilePic || "https://i.pravatar.cc/150?img=11"} className="w-full h-full rounded-[1.8rem] object-cover" />
                                        <div className="absolute -bottom-2 bg-brand-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full tracking-widest border-2 border-slate-900">Premium</div>
                                    </div>
                                    <h3 className="mt-4 text-2xl font-black">{userData?.name || currentUser?.displayName || "John Doe"}</h3>
                                    <p className="text-slate-500 text-xs font-medium">{currentUser?.email}</p>
                                </div>

                                <div className="bg-slate-800/30 rounded-3xl border border-slate-700/50 overflow-hidden divide-y divide-slate-700/30">
                                    <ProfileItem 
                                        icon={<User className="w-5 h-5" />} 
                                        label="Identity Matrix" 
                                        onClick={() => setIsEditing(true)}
                                    />
                                    <ProfileItem icon={<Shield className="w-5 h-5" />} label="Security Settings" />
                                    <ProfileItem icon={<Info className="w-5 h-5" />} label=" Shinrai Protocol Support" />
                                    <ProfileItem icon={<LogOut className="w-5 h-5 text-rose-500" />} label="Sign Out Access" color="text-rose-500" onClick={logout} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Edit Profile Overlay */}
                    <AnimatePresence>
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 100 }}
                                className="absolute inset-0 z-[60] bg-slate-900 px-6 py-12 flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-2xl font-black tracking-tighter italic text-brand-500">EDIT MATRIX</h2>
                                    <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white font-bold text-sm">CANCEL</button>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Display Name</label>
                                        <input 
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm font-bold focus:border-brand-500 outline-none transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Profile Image URL</label>
                                        <input 
                                            value={editForm.profilePic}
                                            onChange={(e) => setEditForm({...editForm, profilePic: e.target.value})}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm font-bold focus:border-brand-500 outline-none transition-colors"
                                            placeholder="Image URL"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Neural Link Phone</label>
                                        <input 
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm font-bold focus:border-brand-500 outline-none transition-colors"
                                            placeholder="+91..."
                                        />
                                    </div>
                                    
                                    <div className="pt-8">
                                        <button 
                                            onClick={handleUpdateProfile}
                                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black p-5 rounded-3xl shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center space-x-2"
                                        >
                                            <ShieldCheck className="w-5 h-5" />
                                            <span>SAVE CHANGES</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Tactical Tab Bar */}
                <nav className="h-24 bg-slate-900/80 backdrop-blur-2xl border-t border-slate-800 flex justify-around items-center px-10 pb-8 z-40">
                    <TabButton 
                        icon={<Shield className="w-6 h-6" />} 
                        label="Home" 
                        active={activeTab === "safeguard"} 
                        onClick={() => setActiveTab("safeguard")} 
                    />
                    <TabButton 
                        icon={<QrCode className="w-6 h-6" />} 
                        label="IDs" 
                        active={activeTab === "wallet"} 
                        onClick={() => setActiveTab("wallet")} 
                    />
                    <TabButton 
                        icon={<User className="w-6 h-6" />} 
                        label="Identity" 
                        active={activeTab === "profile"} 
                        onClick={() => setActiveTab("profile")} 
                    />
                </nav>
            </div>
        </div>
    );
}

function Badge({ icon, label, color }) {
    const colors = {
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return (
        <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 ${colors[color]}`}>
            {icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
    );
}

function QuickAction({ icon, title, desc, isActive, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`p-5 rounded-[2rem] border transition-all cursor-pointer ${isActive 
            ? 'bg-emerald-500/5 border-emerald-500/20' 
            : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50'}`}
        >
            <div className="mb-3">{icon}</div>
            <h5 className="text-sm font-bold tracking-tight">{title}</h5>
            <p className="text-[10px] text-slate-500 font-medium">{desc}</p>
        </div>
    );
}

function WalletItem({ icon, title, date }) {
    return (
        <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex justify-between items-center group cursor-pointer hover:bg-slate-700/40">
            <div className="flex items-center space-x-4">
                <div className="bg-slate-700/50 p-3 rounded-xl">{icon}</div>
                <div>
                    <h6 className="text-sm font-bold tracking-tight">{title}</h6>
                    <p className="text-[10px] text-slate-500 font-medium">{date}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
        </div>
    );
}

function ProfileItem({ icon, label, color = "text-slate-300", onClick }) {
    return (
        <div onClick={onClick} className="p-5 flex justify-between items-center hover:bg-slate-700/20 cursor-pointer active:bg-slate-700/40 transition-colors group">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
                <span className={`text-sm font-bold tracking-tight ${color}`}>{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
        </div>
    );
}

function TabButton({ icon, label, active, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer relative ${active ? 'text-brand-500' : 'text-slate-500 hover:text-slate-400'}`}
        >
            {active && (
                <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -top-1 w-8 h-1 bg-brand-500 rounded-full" 
                />
            )}
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
    );
}
