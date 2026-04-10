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
                        className="h-screen pt-14 pb-24 overflow-y-auto px-5 space-y-8 no-scrollbar"
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
                {activeTab === 'settings' && <PortalSettingsView key="settings" userData={userData} logout={logout} navigate={navigate} />}
            </AnimatePresence>

            {/* Immersive Header */}
            <div className="fixed top-0 inset-x-0 h-14 glass z-[100] safe-top px-6 flex items-center justify-between border-b-0">
                <div className="flex items-center space-x-2" onClick={() => setActiveTab('home')}>
                    <div className={`w-1.5 h-1.5 rounded-full ${panicMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {panicMode ? 'SOS Broadcast Active' : 'Neural Sync: Active'}
                    </span>
                </div>
                <div className="flex items-center space-x-3 text-slate-500">
                    <Wifi className="w-3.5 h-3.5" />
                    <Battery className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold">100%</span>
                </div>
            </div>

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
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen relative pt-14 pb-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-10">
                <Navigation className="w-20 h-20 text-emerald-500/20 mb-6 animate-pulse" />
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 italic">Neural Map <span className="text-emerald-500">Live</span></h3>
                <p className="text-xs text-slate-500 max-w-xs">Connecting to regional satellite nodes... Your real-time geospatial safety context is being synchronized.</p>
                <div className="mt-8 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    GPS LOCK: ACTIVE
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
            className="h-screen pt-20 pb-24 px-6 overflow-y-auto no-scrollbar"
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

function PortalSettingsView({ userData, logout, navigate }) {
    const sections = [
        { icon: <User />, title: "Personal Substrate", desc: "Identity & KYC settings" },
        { icon: <Bell />, title: "Tactical Alerts", desc: "Notification priority logic" },
        { icon: <Shield />, title: "Authority Access", desc: "Police linkage permissions" },
        { icon: <Info />, title: "Legal & Privacy", desc: "Encrypted data protocols" },
    ];

    return (
        <motion.main 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="h-screen pt-20 pb-24 px-6 overflow-y-auto no-scrollbar"
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
                    <button key={i} className="w-full bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all">
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
