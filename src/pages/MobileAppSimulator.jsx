import { useState } from "react";
import { ShieldAlert, MapPin, Navigation, Bell, Settings, AlertTriangle, ShieldCheck, QrCode as QrCodeIcon, Sliders, ChevronRight, Download, FileText, Info, LogOut, CheckCircle, Bot, Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

export default function MobileAppSimulator() {
    const [isTracking, setIsTracking] = useState(true);
    const [panicMode, setPanicMode] = useState(false);
    const [showGeofence, setShowGeofence] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [autoEFir, setAutoEFir] = useState(false);
    const [permissionsChecked, setPermissionsChecked] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hi John! I am your SafeTour AI Guide. How can I assist you in Darjeeling today?' },
        { id: 2, sender: 'user', text: 'Are there any restricted areas near me?' },
        { id: 3, sender: 'ai', text: 'Yes, you are currently 2km away from the Senchal Wildlife restricted core zone. Please stay on the designated paths.' }
    ]);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        setMessages([...messages, { id: Date.now(), sender: 'user', text: chatInput }]);
        setChatInput("");

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                text: "I'm monitoring your route. Stay safe! Let me know if you need emergency assistance or directions."
            }]);
        }, 1000);
    };

    const handlePanic = async () => {
        setPanicMode(true);

        try {
            const response = await fetch('http://localhost:3000/api/alerts/panic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: 'John Doe',
                    location: 'Darjeeling, West Bengal',
                    idNumber: 'AADHAAR-8291-3311-XXXX',
                    phone: '+91 98765 43210',
                    bloodGroup: 'O+'
                })
            });

            if (!response.ok) {
                console.error("Failed to broadcast SOS to central server.");
            }
        } catch (error) {
            console.error("SOS Network Error", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-4 sm:py-8 animate-in fade-in duration-500">
            <div className="text-center mb-8 max-w-lg px-4 hidden sm:block">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Mobile Experience Simulator</h2>
                <p className="text-slate-500 text-sm mt-2">This is what the tourist sees on their device. It includes safety scoring, live location tracking toggle, and the emergency SOS system.</p>
            </div>

            {/* Mobile Device Frame */}
            <div className="w-full sm:w-[380px] h-screen sm:h-[800px] bg-slate-900 sm:rounded-[3rem] sm:p-3 shadow-2xl relative overflow-hidden sm:border-4 border-slate-800 sm:ring-4 ring-slate-900/50">
                {/* Notch (Hidden on mobile web view for realism, shown on desktop as a frame) */}
                <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 hidden sm:flex">
                    <div className="w-32 h-6 bg-slate-900 rounded-b-3xl"></div>
                </div>

                {/* Screen Content */}
                <div className="bg-slate-50 w-full h-full sm:rounded-[2.25rem] overflow-hidden flex flex-col relative">

                    {/* Status Bar */}
                    <div className="h-12 pt-2 px-6 flex justify-between items-center text-[11px] font-medium text-slate-800 z-10 relative hidden sm:flex">
                        <span>9:41</span>
                        <div className="flex items-center space-x-2 gap-1">
                            <span className="w-4 h-3 rounded-sm border border-slate-800 relative"><span className="absolute inset-px bg-slate-800 rounded-sm"></span></span>
                            <span>5G</span>
                            <span className="w-6 h-3 rounded-sm border border-slate-800 relative"><span className="absolute inset-0.5 right-1 bg-slate-800 rounded-sm"></span></span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide relative z-10 pt-6 sm:pt-0">
                        {/* Header */}
                        <div className="flex justify-between items-center mt-2 mb-8">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stay Safe</h1>
                                <p className="text-xs text-slate-500">Darjeeling, West Bengal</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200">
                                <Bell className="w-5 h-5 text-slate-600" />
                            </div>
                        </div>

                        {/* Conditional Rendering based on activeTab */}
                        {activeTab === 'home' ? (
                            <>
                                {/* Geofence Alert */}
                                <AnimatePresence>
                                    {showGeofence && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-amber-100 border border-amber-200 rounded-2xl p-4 mb-6 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle className="w-16 h-16" /></div>
                                            <div className="flex items-start relative z-10">
                                                <div className="bg-amber-500 p-2 rounded-full mr-3 shrink-0">
                                                    <AlertTriangle className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-amber-900">Restricted Zone Approaching</h4>
                                                    <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">You are 500m away from Senchal Wildlife restricted area. Please maintain your current route.</p>
                                                    <button onClick={() => setShowGeofence(false)} className="mt-3 text-xs font-semibold text-amber-700 bg-amber-200/50 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">Acknowledge</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Safety Score */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 mb-6 flex flex-col items-center">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-6">Current Safety Score</h3>
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" className="stroke-slate-100" strokeWidth="12" fill="none" />
                                            <circle cx="80" cy="80" r="70" className={`${panicMode ? 'stroke-rose-500' : 'stroke-emerald-500'} transition-colors duration-1000`} strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset={panicMode ? "300" : "44"} strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className={`text-4xl font-black tracking-tighter ${panicMode ? 'text-rose-600' : 'text-emerald-600'}`}>{panicMode ? '24' : '92'}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">out of 100</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-slate-500 mt-6 px-4">
                                        {panicMode ? 'Critical incident reported. Score reflects active alert status.' : 'Based on area sensitivity, time of day, and cohort proximity.'}
                                    </p>
                                </div>

                                {/* Live Tracking Toggle */}
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/50 mb-6 flex justify-between items-center cursor-pointer" onClick={() => setIsTracking(!isTracking)}>
                                    <div className="flex items-center">
                                        <div className={`p-2.5 rounded-xl mr-3 transition-colors ${isTracking ? 'bg-brand-100' : 'bg-slate-100'}`}>
                                            <Navigation className={`w-5 h-5 transition-colors ${isTracking ? 'text-brand-600' : 'text-slate-400'}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">Live Tracking</h4>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Shared with authorities</p>
                                        </div>
                                    </div>
                                    <button
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isTracking ? 'bg-brand-600' : 'bg-slate-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTracking ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                {/* Panic Button Section */}
                                <div className="mt-8 flex flex-col items-center relative py-4">
                                    {/* Pulse Effect when active */}
                                    {panicMode && (
                                        <>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}></div>
                                        </>
                                    )}

                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePanic}
                                        disabled={panicMode}
                                        className={`relative z-10 w-32 h-32 rounded-full shadow-xl flex flex-col items-center justify-center border-4 transition-all duration-300 ${panicMode
                                            ? 'bg-rose-600 border-rose-400 shadow-[0_0_50px_rgba(225,29,72,0.6)] text-white scale-105'
                                            : 'bg-white border-slate-100 text-rose-600 hover:border-rose-100 hover:bg-rose-50 shadow-rose-500/10'
                                            }`}
                                    >
                                        <ShieldAlert className={`w-12 h-12 mb-1 ${panicMode ? 'animate-pulse' : ''}`} />
                                        <span className="text-sm font-black uppercase tracking-wider">{panicMode ? 'SOS Sent' : 'Panic'}</span>
                                    </motion.button>

                                    <p className={`text-xs mt-6 text-center font-medium transition-colors ${panicMode ? 'text-rose-600' : 'text-slate-400'}`}>
                                        {panicMode ? 'Help is on the way. Live location and audio are being safely transmitted.' : 'Tap and hold in case of emergency'}
                                    </p>

                                    {panicMode && (
                                        <button
                                            onClick={() => setPanicMode(false)}
                                            className="mt-6 text-xs text-slate-500 underline underline-offset-4 hover:text-slate-800 font-medium"
                                        >
                                            Cancel False Alarm (Requires PIN)
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : activeTab === 'id' ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-center pt-2"
                            >
                                <div className="w-full bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                                    {/* Decals & Accents */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center z-10">
                                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-300" />
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-white">Verified</span>
                                    </div>

                                    <div className="relative z-10 pt-4">
                                        <h4 className="font-bold text-xl tracking-wide mb-1">John Doe</h4>
                                        <p className="text-xs text-emerald-100 mb-6">Indian National</p>

                                        <div className="space-y-4 mb-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] text-emerald-200/70 uppercase tracking-widest font-semibold mb-1">ID Number</p>
                                                    <p className="text-sm font-medium">AADHAAR-8291-3311-XXXX</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-emerald-200/70 uppercase tracking-widest font-semibold mb-1">Blood Group</p>
                                                    <p className="text-sm font-medium">O+</p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-white/10">
                                                <p className="text-[10px] text-emerald-200/70 uppercase tracking-widest font-semibold mb-1">Destination</p>
                                                <p className="text-sm font-medium">Leh, Ladakh</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded-xl mx-auto w-32 shadow-inner flex justify-center mt-6">
                                            <QRCodeCanvas
                                                value="sh-id:AADHAAR-8291-3311-Leh,Ladakh"
                                                size={104}
                                                bgColor={"#ffffff"}
                                                fgColor={"#1e293b"}
                                                level={"M"}
                                                includeMargin={false}
                                            />
                                        </div>
                                        <p className="text-center text-[10px] text-white/60 mt-4 tracking-widest uppercase">ID-ST-88192-XX</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-6 text-center px-4 leading-relaxed">
                                    Show this QR code at checkpoints, hotels, and restricted areas for seamless verification.
                                </p>
                            </motion.div>
                        ) : activeTab === 'ai' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col h-full -mx-5 px-5"
                                style={{ height: 'calc(100% - 60px)' }}
                            >
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white mb-4 flex items-center shadow-md">
                                    <div className="bg-white/20 p-2 rounded-full mr-3 border border-white/20">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">SafeTour AI Guide</h3>
                                        <p className="text-[10px] text-indigo-100 flex items-center mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span> Online • Local Context Active
                                        </p>
                                    </div>
                                </div>

                                {/* Chat Messages Area */}
                                <div className="flex-1 overflow-y-auto space-y-4 pb-20 pr-2 scrollbar-hide">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.sender === 'ai' && (
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shrink-0 border border-indigo-200 mt-1">
                                                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                                                </div>
                                            )}
                                            <div className={`max-w-[75%] rounded-2xl p-3 text-sm ${msg.sender === 'user'
                                                    ? 'bg-brand-500 text-white rounded-tr-sm shadow-sm shadow-brand-500/20'
                                                    : 'bg-white text-slate-700 rounded-tl-sm border border-slate-200/60 shadow-sm'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chat Input Area (Fixed slightly above the bottom tabs) */}
                                <div className="absolute bottom-24 inset-x-5 flex items-center space-x-2 bg-white/80 backdrop-blur-md p-2 rounded-full border border-slate-200 shadow-lg shadow-slate-200/50">
                                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask about safety, routes..."
                                        className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none px-2 placeholder-slate-400"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30 hover:bg-brand-600 transition-colors shrink-0"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col pt-2 pb-8"
                            >
                                <div className="flex items-center space-x-3 mb-8 px-2">
                                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                                        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">John Doe</h3>
                                        <p className="text-xs text-slate-500 flex items-center">
                                            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-brand-500" /> Premium Protection Active
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* App Settings Group */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Application Preferences</h4>
                                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                                            <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-brand-50 p-2 rounded-lg"><Download className="w-4 h-4 text-brand-600" /></div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">Check for Updates</p>
                                                        <p className="text-[10px] text-slate-500 mt-0.5">App is up to date (v2.4.1)</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </div>

                                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setAutoEFir(!autoEFir)}>
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-rose-50 p-2 rounded-lg"><FileText className="w-4 h-4 text-rose-600" /></div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">Auto E-FIR Generation</p>
                                                        <p className="text-[10px] text-slate-500 mt-0.5">Automatically file report if missing</p>
                                                    </div>
                                                </div>
                                                <button className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoEFir ? 'bg-rose-500' : 'bg-slate-300'}`}>
                                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoEFir ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security & Permissions Group */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Security & Access</h4>
                                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`p-2 rounded-lg transition-colors ${permissionsChecked ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                                                        {permissionsChecked ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">System Permissions</p>
                                                        {permissionsChecked ? (
                                                            <div className="mt-2 space-y-1.5 flex flex-col">
                                                                <span className="text-[10px] font-medium text-emerald-700 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Location Tracking: Allowed (Always)</span>
                                                                <span className="text-[10px] font-medium text-emerald-700 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Background Audio: Allowed</span>
                                                                <span className="text-[10px] font-medium text-emerald-700 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Push Notifications: Allowed</span>
                                                            </div>
                                                        ) : (
                                                            <p className="text-[10px] text-amber-600 mt-0.5 max-w-[200px]">Missing permissions could inhibit emergency features.</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {!permissionsChecked && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setPermissionsChecked(true); }}
                                                        className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors shrink-0">
                                                        Verify Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* About Group */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">About & Account</h4>
                                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                                            <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-slate-100 p-2 rounded-lg"><Info className="w-4 h-4 text-slate-600" /></div>
                                                    <p className="text-sm font-semibold text-slate-800">Version Info</p>
                                                </div>
                                                <span className="text-xs font-medium text-slate-400">v2.4.1 (Build 8892)</span>
                                            </div>

                                            <div className="p-4 flex items-center justify-between hover:bg-rose-50 transition-colors cursor-pointer group">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-slate-100 group-hover:bg-rose-100 p-2 rounded-lg transition-colors"><LogOut className="w-4 h-4 text-slate-600 group-hover:text-rose-600 transition-colors" /></div>
                                                    <p className="text-sm font-semibold text-slate-800 group-hover:text-rose-700 transition-colors">Logout / Deactivate</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </div>

                    {/* Bottom Tab Bar */}
                    <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center px-6 pb-2 z-20">
                        <div
                            className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'home' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={() => setActiveTab('home')}
                        >
                            <ShieldCheck className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-bold tracking-wide">Safeguard</span>
                        </div>
                        <div
                            className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'id' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={() => setActiveTab('id')}
                        >
                            <QrCodeIcon className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-medium tracking-wide">Digital ID</span>
                        </div>
                        <div
                            className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'ai' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={() => setActiveTab('ai')}
                        >
                            <Bot className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-medium tracking-wide">AI Guide</span>
                        </div>
                        <div
                            className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'settings' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-medium tracking-wide">Settings</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
