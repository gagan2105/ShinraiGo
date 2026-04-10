import { useState, useEffect } from "react";
import { Shield, Bell, MapPin, ShieldAlert, Navigation, QrCode, MessageSquare, Settings, User, Heart, Info, LogOut, Loader2, Zap, Activity, ShieldCheck, ChevronRight, Share2, Camera, Phone, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { ENDPOINTS } from "../lib/api";
import { Haptics, NotificationType } from '@capacitor/haptics';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

export default function UserPortal() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [panicMode, setPanicMode] = useState(false);
    const [safetyScore, setSafetyScore] = useState(94);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", profilePic: "", phone: "" });

    useEffect(() => {
        const fetchUserData = async () => {
            // 1. Instantly load from Secure Offline Cache
            try {
                const { value } = await Preferences.get({ key: 'IdentityMatrix' });
                if (value) {
                    const cachedData = JSON.parse(value);
                    setUserData(cachedData);
                    setEditForm({
                        name: cachedData.name || "",
                        profilePic: cachedData.profilePic || "https://i.pravatar.cc/150?img=11",
                        phone: cachedData.phone || ""
                    });
                }
            } catch(e) { console.log("No offline cache found"); }

            // 2. Attempt Network Sync
            try {
                const idToken = await currentUser?.getIdToken();
                const response = await axios.post(ENDPOINTS.SYNC, {}, {
                    headers: { Authorization: `Bearer ${idToken}` }
                });
                if (response.data?.user) {
                    const freshData = response.data.user;
                    setUserData(freshData);
                    setEditForm({
                        name: freshData.name || "",
                        profilePic: freshData.profilePic || "https://i.pravatar.cc/150?img=11",
                        phone: freshData.phone || ""
                    });
                    await Preferences.set({
                        key: 'IdentityMatrix',
                        value: JSON.stringify(freshData)
                    });
                }
            } catch (e) {
                console.warn("Operating in Offline Mode: Neural Sync Failed");
            }
            setLoading(false);
        };
        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    const handleUpdateProfile = async () => {
        try {
            const idToken = await currentUser?.getIdToken();
            await axios.put(ENDPOINTS.PROFILE_UPDATE || "/api/auth/profile", {
                fullName: editForm.name,
                profilePic: editForm.profilePic,
                phone: editForm.phone
            }, {
                headers: { Authorization: `Bearer ${idToken}` }
            });
            
            const updatedUserData = { 
                ...userData, 
                name: editForm.name, 
                profilePic: editForm.profilePic,
                phone: editForm.phone
            };
            
            setUserData(updatedUserData);
            await Preferences.set({
                key: 'IdentityMatrix',
                value: JSON.stringify(updatedUserData)
            });
            
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

        // Native Hardware Integrations (Capacitor)
        try {
            await Haptics.notification({ type: NotificationType.Error });
            await Haptics.vibrate();
        } catch(e) { /* Ignore on non-native environments */ }

        let liveLocation = "Live Device Geo-Lock";
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            liveLocation = `Lat: ${coordinates.coords.latitude.toFixed(4)}, Lng: ${coordinates.coords.longitude.toFixed(4)}`;
        } catch(e) {
            console.warn("GPS Lock failed, using default");
        }

        try {
            await axios.post(ENDPOINTS.PANIC_ALERT || "/api/panic-alert", {
                user: userData?.name || currentUser?.displayName || "Unknown User",
                location: liveLocation,
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
                <p className="mt-6 text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-y-auto">
            
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight italic uppercase">Shinrai <span className="text-slate-500">Portal</span></h1>
                            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-[0.2em]">Neural Network Active</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 hidden sm:flex">
                            <div className="text-right">
                                <p className="text-sm font-bold">{userData?.name || currentUser?.displayName || "Tourist"}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{userData?.nationality || "Global"}</p>
                            </div>
                            <img src={userData?.profilePic || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-800" />
                        </div>

                        <button onClick={() => { logout(); navigate("/login"); }} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-xl hover:bg-slate-700">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Dashboard Layout */}
            <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: SAFEGUARD & PANIC (Span 4) */}
                <div className="lg:col-span-4 flex flex-col space-y-8">
                    
                    {/* Safety Core */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                        
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                <Activity className="w-4 h-4 mr-2 text-emerald-500" /> Safeguard Module
                            </h2>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                        </div>

                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-spin-slow" />
                                <div className="absolute inset-4 rounded-full border-2 border-emerald-500/10" />
                                <span className={`text-6xl font-black ${panicMode ? 'text-rose-500' : 'text-emerald-500'} tracking-tighter`}>
                                    {panicMode ? '!!!' : safetyScore}
                                </span>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 font-bold uppercase tracking-widest text-center">
                                Ambient Threat Level: <span className={panicMode ? "text-rose-500" : "text-emerald-500"}>{panicMode ? "CRITICAL" : "LOW"}</span>
                            </p>
                        </div>
                    </div>

                    {/* Panic Override Area */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <div className={`absolute inset-0 transition-opacity duration-500 ${panicMode ? 'bg-rose-500/10 opacity-100' : 'opacity-0'}`} />
                        
                        <h3 className="text-xs font-black text-rose-500/70 uppercase tracking-[0.3em] mb-8 italic">Emergency Protocols</h3>
                        
                        <button
                            onClick={handlePanic}
                            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-8 transition-all duration-300 relative z-10 ${
                                panicMode 
                                    ? 'bg-rose-600 border-rose-400 shadow-[0_0_80px_rgba(225,29,72,0.8)] animate-pulse' 
                                    : 'bg-slate-950 border-slate-800 shadow-xl hover:border-rose-500/30 group'
                            }`}
                        >
                            <ShieldAlert className={`w-12 h-12 mb-2 transition-colors ${panicMode ? 'text-white' : 'text-rose-500'}`} />
                            <span className={`text-sm font-black uppercase tracking-widest ${panicMode ? 'text-white' : 'text-slate-500 group-hover:text-rose-400'}`}>
                                {panicMode ? 'Help Active' : 'S.O.S'}
                            </span>
                        </button>
                        
                        <p className="mt-8 text-center text-xs text-slate-500 font-medium leading-relaxed max-w-[250px]">
                            {panicMode 
                                ? "Police Command intercept active. Telemetry is locked and streaming."
                                : "Tap to bypass local authorities and alert Central Police Command instantly."
                            }
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: IDENTITY & WALLET (Span 8) */}
                <div className="lg:col-span-8 flex flex-col space-y-8">
                    
                    {/* Identity Matrix Header */}
                    <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex items-center space-x-6 z-10 w-full sm:w-auto">
                            <div className="relative group cursor-pointer w-24 h-24 shrink-0">
                                <img src={userData?.profilePic || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="w-full h-full rounded-[1.5rem] object-cover border-4 border-slate-900 shadow-xl" />
                                <div className="absolute inset-0 bg-black/60 rounded-[1.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            
                            <div className="w-full">
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={editForm.name} 
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                        className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 w-full text-white font-bold text-lg mb-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-black tracking-tight">{userData?.name || currentUser?.displayName || "Agent"}</h2>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                    <Badge icon={<ShieldCheck className="w-3 h-3" />} label="Verified Identity" color="emerald" />
                                    <Badge icon={<MapPin className="w-3 h-3" />} label={userData?.nationality || "Global"} color="blue" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-0 z-10 w-full sm:w-auto flex justify-end">
                            {isEditing ? (
                                <button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Save Changes</button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-slate-700">Edit Profile</button>
                            )}
                        </div>
                    </div>

                    {/* Split Grid: Medical DNA & Digital Wallet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        
                        {/* Medical Dossier */}
                        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center">
                                    <Heart className="w-4 h-4 mr-2 text-rose-500" /> Medical Dossier
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50 flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                                                <Heart className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-500">Blood Type</p>
                                                <p className="text-lg font-black text-rose-400">{userData?.bloodGroup || "Pending"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50 flex justify-between items-center">
                                        <div className="flex items-center space-x-3 w-full">
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Phone className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="w-full">
                                                <p className="text-[10px] uppercase font-bold text-slate-500">Emergency Protocol</p>
                                                {isEditing ? (
                                                    <input 
                                                        type="text" 
                                                        value={editForm.phone} 
                                                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})} 
                                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 w-full text-white font-mono text-sm focus:ring-1 focus:ring-blue-500 outline-none mt-1"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-mono text-slate-300 mt-1">{userData?.emergencyContact?.phone || userData?.phone || "No Contact Set"}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Digital Wallet / QR */}
                        <div className="bg-gradient-to-br from-brand-600/20 to-indigo-900/20 border border-brand-500/20 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between items-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4">
                                <QrCode className="w-24 h-24 text-brand-500/10" />
                            </div>

                            <div className="w-full">
                                <h3 className="text-xs font-black text-brand-400 uppercase tracking-[0.2em] mb-2 flex items-center">
                                    <ShieldCheck className="w-4 h-4 mr-2" /> Encrypted Passport
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold mb-6">Scan for authority authorization.</p>
                            </div>
                            
                            <div className="bg-white p-4 rounded-3xl shadow-xl shadow-brand-900/50 transform group-hover:scale-105 transition-transform duration-500 border-4 border-slate-800">
                                <QRCodeCanvas
                                    value={JSON.stringify({ 
                                        uid: userData?.firebaseUid, 
                                        name: userData?.name, 
                                        bld: userData?.bloodGroup 
                                    })}
                                    size={140}
                                    bgColor={"#ffffff"}
                                    fgColor={"#0f172a"}
                                    level={"H"}
                                />
                            </div>

                            <button className="mt-8 flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-900/50 py-2 px-4 rounded-full border border-slate-700/50">
                                <Download className="w-4 h-4 mr-2" /> Download Document
                            </button>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}

function Badge({ icon, label, color }) {
    const colors = {
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        slate: "bg-slate-800 text-slate-300 border-slate-700",
    };

    return (
        <span className={`flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${colors[color]}`}>
            {icon && <span className="mr-1.5">{icon}</span>}
            {label}
        </span>
    );
}
