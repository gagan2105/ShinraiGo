import { Activity, AlertOctagon, Map, Clock, Target, AlertTriangle, ShieldCheck } from "lucide-react";
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
                                        onClick={() => toast.loading(`Generating E-FIR module for ${anm.id}...`, { duration: 2000 })}
                                        className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap">
                                        Investigate
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
                </div>
            </div>
        </div>
    );
}
