import { useState } from "react";
import { Activity, AlertOctagon, Map, Clock, Target, AlertTriangle, ShieldCheck } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "sonner";

const anomalies = [
    {
        id: "ANM-8892",
        type: "Sudden Location Drop-off",
        tourist: "Elena Rostova (ID: #4312)",
        location: "Sela Pass, Arunachal Pradesh",
        time: "4 mins ago",
        severity: "Critical",
        details: "Signal lost completely after moving at 60km/h. Last known coordinate locked.",
        icon: AlertOctagon,
        color: "rose"
    },
    {
        id: "ANM-8891",
        type: "Route Deviation Detected",
        tourist: "Tour Group Alpha (8 members)",
        location: "Zuluk Silk Route",
        time: "18 mins ago",
        severity: "Warning",
        details: "Deviated 2km off the registered itinerary path heading towards restricted border zone.",
        icon: Target,
        color: "amber"
    },
    {
        id: "ANM-8890",
        type: "Prolonged Inactivity",
        tourist: "David Chen (ID: #8831)",
        location: "Living Root Bridges, Meghalaya",
        time: "1 hr 12 mins ago",
        severity: "Info",
        details: "Device stationary for over 4 hours in dense forest block. Heart rate signal (IoT band) normal.",
        icon: Clock,
        color: "blue"
    },
    {
        id: "ANM-8889",
        type: "Group Separation",
        tourist: "Family Batch B (ID: #9941)",
        location: "Kaziranga Safari Zone 2",
        time: "2 hrs ago",
        severity: "Warning",
        details: "One ID tag moving 3km apart from the rest of the registered family cluster.",
        icon: AlertTriangle,
        color: "amber"
    }
];

export default function AnomalyDetection() {
    const [filedReports, setFiledReports] = useState([]);

    const handleInvestigate = (anm) => {
        const toastId = toast.loading(`Generating E-FIR module for incident ${anm.id}...`);
        
        // Simulating the backend AI processing the E-FIR compilation
        setTimeout(() => {
            toast.dismiss(toastId);
            toast.success(`E-FIR for ${anm.tourist} successfully filed in the central blockchain repository.`);
            setFiledReports(prev => [...prev, anm.id]);
        }, 2500);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI Anomaly Detection</h2>
                    <p className="text-slate-500 text-sm mt-1">Machine learning insights flagging unusual behaviors and risks automatically.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        AI Engine Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {anomalies.map((anm) => (
                        <div key={anm.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${anm.color === 'rose' ? 'bg-rose-500' : anm.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className={`mt-1 p-2.5 rounded-xl flex-shrink-0 ${anm.color === 'rose' ? 'bg-rose-100 text-rose-600' : anm.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <anm.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3 mb-1">
                                            <h3 className="text-base font-bold text-slate-900">{anm.type}</h3>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${anm.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                                anm.severity === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {anm.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">{anm.tourist}</p>
                                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{anm.details}</p>
                                        <div className="flex items-center space-x-4 mt-4 text-xs font-medium text-slate-400">
                                            <span className="flex items-center px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                                                <span className="font-semibold text-slate-600 mr-2">ID:</span> {anm.id}
                                            </span>
                                            <span className="flex items-center">
                                                <Map className="w-3.5 h-3.5 mr-1" /> {anm.location}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1" /> {anm.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        disabled={filedReports.includes(anm.id)}
                                        onClick={() => handleInvestigate(anm)}
                                        className={`px-4 py-2 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap ${filedReports.includes(anm.id) ? 'bg-emerald-600 hover:bg-emerald-600 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}>
                                        {filedReports.includes(anm.id) ? 'E-FIR Filed ✔️' : 'Investigate & File E-FIR'}
                                    </button>
                                    <button
                                        onClick={() => toast.success(`Patrol unit dispatched to ${anm.location}`)}
                                        className="px-4 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                                        Dispatch Patrol
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Intelligence Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold flex items-center mb-6">
                                <ShieldCheck className="w-5 h-5 text-brand-400 mr-2" />
                                Model Confidence
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Location Drop-off Precision</span>
                                        <span className="font-bold text-white">94.2%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5 flex overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "94.2%" }} transition={{ duration: 1, delay: 0.1 }} className="bg-brand-500 h-1.5 rounded-full"></motion.div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Route Deviation Recall</span>
                                        <span className="font-bold text-white">88.5%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5 flex overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "88.5%" }} transition={{ duration: 1, delay: 0.3 }} className="bg-amber-500 h-1.5 rounded-full"></motion.div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">False Positive Rate</span>
                                        <span className="font-bold text-white">1.2%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5 flex overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "1.2%" }} transition={{ duration: 1, delay: 0.5 }} className="bg-rose-500 h-1.5 rounded-full"></motion.div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Models are continuously training on newly collected anonymized geographic and temporal records from active IoT tags and Mobile Apps.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Neural Behavior Graph */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 overflow-hidden">
                        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-indigo-500" />
                            Neural Behavior Risk Vectors
                        </h3>
                        
                        <div className="relative h-40 w-full bg-slate-50 rounded-xl border border-slate-100 p-2 overflow-hidden flex items-end">
                            <svg className="absolute inset-0 w-full h-full p-2" preserveAspectRatio="none">
                                {/* Risk Vector Line 1 (Anomalous) */}
                                <motion.path
                                    d="M0 80 Q 20 20, 40 70 T 80 10 T 120 60 T 160 30 T 200 90"
                                    fill="none"
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                                />
                                {/* Risk Vector Line 2 (Normal) */}
                                <motion.path
                                    d="M0 90 Q 30 85, 60 92 T 120 88 T 180 95 T 240 90"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            </svg>
                            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1"></span> Anomalous Signal
                                </span>
                                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span> Expected Baseline
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detection Latency</p>
                                <p className="text-lg font-black text-slate-700">1.4s</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nodes Connected</p>
                                <p className="text-lg font-black text-slate-700">12,840</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
