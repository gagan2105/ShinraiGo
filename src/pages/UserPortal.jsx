import { useState, useEffect, useRef } from "react";
import { Shield, Bell, MapPin, ShieldAlert, Navigation, QrCode, MessageSquare, Settings, User, Heart, Info, LogOut, Loader2, Zap, Activity, ShieldCheck, ChevronRight, Share2, Camera, Phone, Download, RefreshCcw, Wifi, Battery, Search, Eye, Clock, ZapOff, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { ENDPOINTS } from "../lib/api";
import { Haptics, NotificationType, ImpactStyle } from '@capacitor/haptics';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import MapComponent from "../components/MapComponent";

export default function UserPortal() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    
    // Safety States
    const [panicMode, setPanicMode] = useState(false);
    const [shakeEnabled, setShakeEnabled] = useState(true);
    const [acousticEnabled, setAcousticEnabled] = useState(false);
    const [arrivalTimer, setArrivalTimer] = useState(0); // in seconds
    const [timerActive, setTimerActive] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    // Interval Refs
    const timerRef = useRef(null);
    const shakeRef = useRef({ x: 0, y: 0, z: 0, lastUpdate: 0 });

    useEffect(() => {
        const init = async () => {
            await fetchUserData(true);
            setLoading(false);
            setupShakeDetection();
        };
        init();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []);

    // SHAKE DETECTION LOGIC (KINETIC SOS)
    const setupShakeDetection = () => {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', handleMotion, true);
        }
    };

    const handleMotion = (event) => {
        if (!shakeEnabled || panicMode) return;
        
        const curTime = new Date().getTime();
        if ((curTime - shakeRef.current.lastUpdate) > 100) {
            const diffTime = curTime - shakeRef.current.lastUpdate;
            shakeRef.current.lastUpdate = curTime;

            const acc = event.accelerationIncludingGravity;
            const x = acc.x; const y = acc.y; const z = acc.z;

            const speed = Math.abs(x + y + z - shakeRef.current.x - shakeRef.current.y - shakeRef.current.z) / diffTime * 10000;

            if (speed > 800) { // Shake Threshold
                triggerSOS("Kinetic Motion Detected (Shake)");
            }

            shakeRef.current.x = x; shakeRef.current.y = y; shakeRef.current.z = z;
        }
    };

    // SHADOW TIMER LOGIC (SAFE ARRIVAL)
    useEffect(() => {
        if (timerActive && arrivalTimer > 0) {
            timerRef.current = setInterval(() => {
                setArrivalTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setTimerActive(false);
                        triggerSOS("Safe Arrival Timer Expired (No Check-in)");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [timerActive, arrivalTimer]);

    const fetchUserData = async (silent = false) => {
        if (!silent) setRefreshing(true);
        try {
            const { value } = await Preferences.get({ key: 'IdentityMatrix' });
            if (value) setUserData(JSON.parse(value));

            let idToken = currentUser?.isDummy ? "DUMMY_TOKEN" : await currentUser?.getIdToken();
            const response = await axios.post(ENDPOINTS.SYNC, {}, {
                headers: { Authorization: `Bearer ${idToken}` },
                timeout: 5000
            });
            if (response.data?.user) {
                setUserData(fresh => ({...fresh, ...response.data.user}));
                await Preferences.set({ key: 'IdentityMatrix', value: JSON.stringify(response.data.user) });
            }
        } catch (e) { console.warn("Offline link active."); }
        setRefreshing(false);
    };

    const triggerSOS = async (reason = "Manual Trigger") => {
        if (panicMode) return;
        setPanicMode(true);
        
        toast.error("SOS EMITTED: " + reason.toUpperCase(), {
            description: "Live telemetry and audio broadcast active.",
            duration: 10000
        });

        // 1. Audio Sentinel Integration
        let audioLevel = 0.5; // Default fallback
        try {
            const permission = await VoiceRecorder.requestAudioRecordingPermission();
            if (permission.value) {
                await VoiceRecorder.startRecording();
                await new Promise(r => setTimeout(r, 1200)); // Sample window
                const { value } = await VoiceRecorder.getCurrentAmplitude();
                audioLevel = value;
                await VoiceRecorder.stopRecording();
            }
        } catch (e) {
            console.warn("Audio Sentinel: Micro-sample failed", e);
        }

        // 2. Hardware Feedback
        try {
            await Haptics.notification({ type: NotificationType.Error });
            await Haptics.vibrate();
        } catch(e) { }

        // 3. Coordinate Lock
        let liveLocation = "Live Device Geo-Lock";
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            liveLocation = `Lat: ${coordinates.coords.latitude.toFixed(4)}, Lng: ${coordinates.coords.longitude.toFixed(4)}`;
        } catch(e) {
            console.warn("GPS Lock failed");
        }

        // 4. Dispatch to Neural Backend
        try {
            await axios.post(ENDPOINTS.PANIC_ALERT || "/api/alerts/panic", {
                user: userData?.name || currentUser?.displayName || "Unknown User",
                location: liveLocation,
                phone: userData?.phone || currentUser?.email || "911",
                bloodGroup: userData?.bloodGroup || "Pending",
                idNumber: userData?.firebaseUid || "Anonymous",
                reason: reason,
                audioLevel: audioLevel,
                motionLevel: 0.88 // Simulated panic shaking velocity
            });
        } catch (e) {
            console.warn("Panic network bypass active");
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-hidden neural-bg">
            <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                    <motion.main 
                        key="home"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-screen pt-8 pb-24 overflow-y-auto px-5 space-y-8 no-scrollbar"
                    >
                        {/* Status Dashboard */}
                        <section className="pt-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                                
                                {timerActive && (
                                    <div className="mb-6 bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Safe Arrival Timer</p>
                                                <p className="text-xl font-black text-blue-400 tracking-tighter">{formatTime(arrivalTimer)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setTimerActive(false); setArrivalTimer(0); }} className="bg-slate-900 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-white/5">I'm Safe</button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <img src={userData?.profilePic || "https://i.pravatar.cc/150?img=11"} className="w-16 h-16 rounded-[1.25rem] border-2 border-white/5 object-cover" />
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-slate-900 flex items-center justify-center"><ShieldCheck className="w-2.5 h-2.5 text-white" /></div>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black tracking-tight tracking-tighter italic uppercase">{userData?.name?.split(' ')[0] || "Agent"} <span className="text-slate-500">Go</span></h2>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Safeguard Level: Gold</p>
                                        </div>
                                    </div>
                                    <button onClick={() => fetchUserData()} className={`p-3 rounded-full transition-all ${refreshing ? 'animate-spin' : 'hover:bg-white/5'}`}><RefreshCcw className="w-4 h-4 text-slate-500" /></button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-950/40 rounded-3xl p-4 border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Shake-to-SOS</p>
                                        <button onClick={() => setShakeEnabled(!shakeEnabled)} className={`flex items-center text-sm font-bold ${shakeEnabled ? 'text-emerald-500' : 'text-slate-600'}`}>
                                            {shakeEnabled ? <Zap className="w-3 h-3 mr-1" /> : <ZapOff className="w-3 h-3 mr-1" />}
                                            {shakeEnabled ? 'Enabled' : 'Disabled'}
                                        </button>
                                    </div>
                                    <div className="bg-slate-950/40 rounded-3xl p-4 border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Acoustic Guard</p>
                                        <button onClick={() => setAcousticEnabled(!acousticEnabled)} className={`flex items-center text-sm font-bold ${acousticEnabled ? 'text-blue-500' : 'text-slate-600'}`}>
                                            <Mic className="w-3 h-3 mr-1" />
                                            {acousticEnabled ? 'Monitoring' : 'Standby'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        {/* SOS Interaction */}
                        <section className="flex flex-col items-center justify-center py-4">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onDoubleClick={() => triggerSOS("Manual Emergency Protocol")}
                                className={`w-52 h-52 rounded-full glass flex flex-col items-center justify-center border-2 transition-all duration-500 relative ${
                                    panicMode ? 'border-rose-500 shadow-[0_0_60px_rgba(225,29,72,0.4)] animate-sos' : 'border-white/5'
                                }`}
                            >
                                <ShieldAlert className={`w-16 h-16 mb-2 transition-colors ${panicMode ? 'text-rose-500' : 'text-rose-500/30'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${panicMode ? 'text-rose-500' : 'text-slate-700'}`}>
                                    {panicMode ? 'Police Alerted' : 'Double-Tap SOS'}
                                </span>
                            </motion.button>
                        </section>

                        {/* Command Tiles */}
                        <section className="grid grid-cols-2 gap-4 pb-12">
                            <CommandTile icon={<Clock />} title="Shadow Timer" color="blue" onClick={() => { setArrivalTimer(600); setTimerActive(true); toast.info("Safe Arrival Timer: 10m set"); }} />
                            <CommandTile icon={<MapPin />} title="Danger Zones" color="emerald" onClick={() => setActiveTab('map')} />
                            <CommandTile icon={<QrCode />} title="Offline ID" color="indigo" onClick={() => setActiveTab('wallet')} />
                            <CommandTile icon={<MessageSquare />} title="Neural Chat" color="amber" onClick={() => toast.info("Neural Chat: Agent 402 is standing by.")} />
                        </section>
                    </motion.main>
                )}

                {activeTab === 'map' && <PortalMapView key="map" />}
                {activeTab === 'wallet' && <PortalWalletView key="wallet" userData={userData} />}
                {activeTab === 'settings' && (
                    <PortalSettingsView 
                        key="settings" 
                        userData={userData} 
                        setUserData={setUserData}
                        logout={logout} 
                        navigate={navigate} 
                        shakeEnabled={shakeEnabled}
                        setShakeEnabled={setShakeEnabled}
                        acousticEnabled={acousticEnabled}
                        setAcousticEnabled={setAcousticEnabled}
                    />
                )}
            </AnimatePresence>

            {/* Bottom Floating Navigation */}
            <div className="fixed bottom-6 inset-x-6 h-16 glass rounded-2xl flex items-center justify-around px-2 z-[100] safe-bottom shadow-2xl border border-white/5">
                <TabButton active={activeTab === 'home'} icon={<Activity />} onClick={() => setActiveTab('home')} />
                <TabButton active={activeTab === 'map'} icon={<Navigation />} onClick={() => setActiveTab('map')} />
                <div className="relative -top-6">
                    <button onClick={() => triggerSOS("Quick Access SOS")} className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
                        <Shield className="w-7 h-7 text-white" />
                    </button>
                </div>
                <TabButton active={activeTab === 'wallet'} icon={<QrCode />} onClick={() => setActiveTab('wallet')} />
                <TabButton active={activeTab === 'settings'} icon={<Settings />} onClick={() => setActiveTab('settings')} />
            </div>
        </div>
    );
}

// UI COMPONENTS
function CommandTile({ icon, title, color, onClick }) {
    const colors = { blue: "text-blue-500 bg-blue-500/5", emerald: "text-emerald-500 bg-emerald-500/5", indigo: "text-indigo-500 bg-indigo-500/5", amber: "text-amber-500 bg-amber-500/5" };
    return (
        <button onClick={onClick} className="glass rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 active:scale-95 transition-all border border-white/5 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${colors[color]}`}>{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{title}</span>
        </button>
    );
}
function TabButton({ active, icon, onClick }) { return ( <button onClick={onClick} className={`w-12 h-12 flex items-center justify-center transition-all rounded-xl ${active ? 'bg-blue-600/10 text-blue-500' : 'text-slate-600 hover:text-slate-400'}`}>{icon}</button> ); }
function LoadingSkeleton() { return ( <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8"><div className="w-16 h-16 bg-blue-600 rounded-2xl animate-pulse flex items-center justify-center shadow-2xl"><Shield className="w-8 h-8 text-white" /></div><p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing Command Center...</p></div> ); }

// PORTAL SUB-VIEWS
function PortalMapView() {
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen relative pt-8 pb-24 flex items-center justify-center">
            <div className="absolute inset-x-4 top-8 bottom-28 glass rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <MapComponent enableSmartRouting={true} />
            </div>
            {/* Overlay Info */}
            <div className="absolute top-12 left-8 right-8 z-[10] flex justify-between items-center pointer-events-none">
                <div className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Neural Map Lock</span>
                </div>
            </div>
        </motion.main>
    );
}

function PortalWalletView({ userData }) {
    return (
        <motion.main 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="h-screen pt-12 pb-24 px-6 overflow-y-auto no-scrollbar"
        >
            <div className="mb-8">
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">Identity <span className="text-blue-500">Matrix</span></h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Decentralized Trust Wallet</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute top-6 right-6 px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center">
                    <ShieldCheck className="w-3 h-3 text-blue-400 mr-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Verified</span>
                </div>

                <div className="flex items-center space-x-4 mb-10">
                    <img src={userData?.profilePic || "https://i.pravatar.cc/150?img=11"} className="w-14 h-14 rounded-2xl object-cover border border-white/10" />
                    <div>
                        <h4 className="text-lg font-black tracking-tight">{userData?.name || "Anonymous Traveler"}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{userData?.nationality || "Global Citizen"}</p>
                    </div>
                </div>

                <div className="space-y-6 mb-10">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">ID Protocol</p>
                            <p className="text-xs font-bold font-mono text-slate-200">SHINRAI-{userData?.bloodGroup || 'UNK'}-992</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Blood Group</p>
                            <p className="text-xs font-bold text-slate-200">{userData?.bloodGroup || 'Not Set'}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Contact Anchor</p>
                        <p className="text-xs font-bold text-slate-200">{userData?.phone || "No Phone Linked"}</p>
                    </div>
                </div>

                <div className="bg-white/95 p-4 rounded-3xl flex justify-center items-center shadow-inner">
                    <QRCodeCanvas value={userData?.firebaseUid || "SHINRAI-GENERIC"} size={140} fgColor="#020617" />
                </div>
                <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mt-6">Scan for Immediate Verification</p>
            </div>

            <div className="mt-6 flex space-x-4">
                <button className="flex-1 bg-white/5 border border-white/5 py-4 rounded-2xl flex items-center justify-center group active:scale-95 transition-all">
                    <Download className="w-4 h-4 text-slate-500 mr-2 group-hover:text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offline Export</span>
                </button>
                <button className="flex-1 bg-white/5 border border-white/5 py-4 rounded-2xl flex items-center justify-center group active:scale-95 transition-all">
                    <Share2 className="w-4 h-4 text-slate-500 mr-2 group-hover:text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cast Sync</span>
                </button>
            </div>
        </motion.main>
    );
}

function PortalSettingsView({ userData, setUserData, logout, navigate, shakeEnabled, setShakeEnabled, acousticEnabled, setAcousticEnabled }) {
    const [subTab, setSubTab] = useState('list');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        bloodGroup: userData?.bloodGroup || 'O+',
        profilePic: userData?.profilePic || "https://i.pravatar.cc/150?img=11"
    });
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm({ ...editForm, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            // Update Local State
            const updatedUser = { ...userData, ...editForm };
            setUserData(updatedUser);
            
            // Save to Local Capacitor Storage
            await Preferences.set({ key: 'IdentityMatrix', value: JSON.stringify(updatedUser) });

            // Push to Backend
            let idToken = "DUMMY_TOKEN"; 
            try { 
                await axios.post(ENDPOINTS.SYNC, { ...editForm, isUpdate: true }, {
                    headers: { Authorization: `Bearer ${idToken}` }
                });
            } catch(e) { console.warn("Backend sync failed, saved locally."); }

            toast.success("Identity Matrix Updated");
            setIsEditing(false);
        } catch (e) {
            toast.error("Bridge Error: Save failed");
        }
        setSaving(false);
    };
    
    if (subTab === 'personal') {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-screen pt-12 px-6 overflow-y-auto no-scrollbar pb-32">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setSubTab('list')} className="text-blue-500 text-xs font-bold uppercase flex items-center"><ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back</button>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="text-emerald-500 text-xs font-bold tracking-widest uppercase">Edit Profile</button>
                    ) : (
                        <button onClick={() => setIsEditing(false)} className="text-rose-500 text-xs font-bold tracking-widest uppercase">Cancel</button>
                    )}
                </div>
                
                <h3 className="text-xl font-black uppercase mb-8 italic">Personal <span className="text-slate-500">Substrate</span></h3>
                
                <div className="flex justify-center mb-8 relative">
                    <button 
                        disabled={!isEditing}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-white/5 bg-slate-900 flex items-center justify-center relative group transition-all ${isEditing ? 'ring-2 ring-blue-500/50 scale-105 shadow-2xl shadow-blue-500/20' : ''}`}
                    >
                        <img src={isEditing ? editForm.profilePic : userData?.profilePic || "https://i.pravatar.cc/150?img=11"} className="w-full h-full object-cover" />
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </button>
                    {isEditing && (
                        <div className="absolute -bottom-2 bg-blue-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow-lg animate-bounce">Change</div>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.name} 
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-sm mt-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Emergency Phone</label>
                                <input 
                                    type="text" 
                                    value={editForm.phone} 
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-sm mt-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Blood Profile</label>
                                <select 
                                    value={editForm.bloodGroup} 
                                    onChange={(e) => setEditForm({...editForm, bloodGroup: e.target.value})}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-sm mt-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>
                        <button 
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize & Sync Updates"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Data Identity</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-xs text-slate-400">Full Name</span>
                                    <span className="text-xs font-bold text-white">{userData?.name || "Unknown User"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-xs text-slate-400">Emergency Anchor</span>
                                    <span className="text-xs font-bold text-white">{userData?.phone || "Pending Link"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-xs text-slate-400">Blood Profile</span>
                                    <span className="text-xs font-bold text-blue-500">{userData?.bloodGroup || "O+"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }

    if (subTab === 'alerts') {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-screen pt-12 px-6">
                <button onClick={() => setSubTab('list')} className="text-blue-500 text-xs font-bold uppercase mb-6 flex items-center"><ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Settings</button>
                <h3 className="text-xl font-black uppercase mb-8 italic">Tactical <span className="text-slate-500">Alerts</span></h3>
                <div className="space-y-4">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-black italic">Shake-to-SOS</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">Kinetic Trigger Logic</p>
                        </div>
                        <button 
                            onClick={() => setShakeEnabled(!shakeEnabled)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${shakeEnabled ? 'bg-emerald-500' : 'bg-slate-800'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${shakeEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-black italic">Acoustic Guard</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">Micro-Sample Monitoring</p>
                        </div>
                        <button 
                            onClick={() => setAcousticEnabled(!acousticEnabled)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${acousticEnabled ? 'bg-blue-500' : 'bg-slate-800'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${acousticEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (subTab === 'authority') {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-screen pt-12 px-6">
                <button onClick={() => setSubTab('list')} className="text-blue-500 text-xs font-bold uppercase mb-6 flex items-center"><ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Settings</button>
                <h3 className="text-xl font-black uppercase mb-8 italic">Authority <span className="text-slate-500">Access</span></h3>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                    <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-50" />
                    <p className="text-sm font-black italic mb-2 tracking-tight">POLICE_LINK: ESTABLISHED</p>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto mb-6">Your device has a bi-directional telemetry bridge to the local SOS Command Center. Data is only accessible during an active emergency event.</p>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-500 uppercase">Status: Low Latency Connect</div>
                </div>
            </motion.div>
        );
    }

    if (subTab === 'legal') {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-screen pt-12 px-6 overflow-y-auto no-scrollbar pb-32">
                <button onClick={() => setSubTab('list')} className="text-blue-500 text-xs font-bold uppercase mb-6 flex items-center"><ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Settings</button>
                <h3 className="text-xl font-black uppercase mb-8 italic">Legal & <span className="text-slate-500">Privacy</span></h3>
                <div className="space-y-6 text-slate-400">
                    <section>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 italic">Neural Shield Protocol</h4>
                        <p className="text-[11px] leading-relaxed">All data packets transmitted during an SOS event are encrypted using AES-256 standard. Private keys are rotation-based and controlled by the Tourist Command Authority.</p>
                    </section>
                    <section>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 italic">Data Retention</h4>
                        <p className="text-[11px] leading-relaxed">Safety telemetry is stored on a decentralized ledger for a period of 14 days following an incident, after which the identity markers are purged from the active substrate.</p>
                    </section>
                </div>
            </motion.div>
        );
    }

    const sections = [
        { icon: <User />, title: "Personal Substrate", desc: "Identity & KYC settings", id: 'personal' },
        { icon: <Bell />, title: "Tactical Alerts", desc: "Notification priority logic", id: 'alerts' },
        { icon: <Shield />, title: "Authority Access", desc: "Police linkage permissions", id: 'authority' },
        { icon: <Info />, title: "Legal & Privacy", desc: "Encrypted data protocols", id: 'legal' },
    ];

    return (
        <motion.main 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="h-screen pt-12 pb-24 px-6 overflow-y-auto no-scrollbar"
        >
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">Command <span className="text-slate-500">Settings</span></h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">V-3.1 Prototype Interface</p>
                </div>
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                    <Settings className="w-5 h-5 text-slate-400" />
                </div>
            </div>

            <div className="space-y-4">
                {sections.map((item, i) => (
                    <button key={i} onClick={() => setSubTab(item.id)} className="w-full bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">{item.icon}</div>
                            <div className="text-left">
                                <h4 className="text-sm font-black tracking-tight">{item.title}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.desc}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                    </button>
                ))}
            </div>

            <div className="mt-12 bg-rose-500/5 border border-rose-500/10 rounded-3xl p-6">
                 <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">Critical Actions</p>
                 <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-2xl flex items-center justify-center shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
                 >
                    <LogOut className="w-5 h-5 mr-3" />
                    De-Authorize Session
                 </button>
            </div>

            <p className="text-center mt-12 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Shinrai Protocol V.3.0.1</p>
        </motion.main>
    );
}
