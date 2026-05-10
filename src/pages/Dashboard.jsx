import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertCircle, Map, Activity, BellRing, ArrowUpRight, ArrowDownRight, X, Shield, Phone, Crosshair, Clock, FileText } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import AdvancedIntelligenceDashboard from "../components/AdvancedIntelligenceDashboard";

const data = [
    { time: "00:00", tourists: 1200, alerts: 2 },
    { time: "04:00", tourists: 900, alerts: 1 },
    { time: "08:00", tourists: 2400, alerts: 5 },
    { time: "12:00", tourists: 4800, alerts: 12 },
    { time: "16:00", tourists: 5100, alerts: 8 },
    { time: "20:00", tourists: 3800, alerts: 15 },
    { time: "24:00", tourists: 1500, alerts: 3 },
];

const recentAlerts = [
    { id: 1, type: "Panic Button triggered", location: "Tiger Hill, Darjeeling", time: "2 mins ago", status: "Critical", user: "John Doe (ID: #8821)" },
    { id: 2, type: "Route Deviation Detected", location: "Spiti Valley Road, HP", time: "15 mins ago", status: "Warning", user: "Alice Smith (ID: #9932)" },
    { id: 3, type: "Prolonged Inactivity", location: "Key Monastery Area", time: "1 hr ago", status: "Resolved", user: "Mike Johnson (ID: #7741)" },
    { id: 4, type: "Restricted Zone Entry", location: "Kaziranga Core Zone", time: "2 hrs ago", status: "Critical", user: "Priya Patel (ID: #4412)" },
];

export default function Dashboard() {
    const [selectedIncident, setSelectedIncident] = useState(null);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <AnimatePresence>
                {selectedIncident && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
                            onClick={() => setSelectedIncident(null)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${selectedIncident.status === 'Critical' ? 'bg-rose-100 text-rose-600' : selectedIncident.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{selectedIncident.type}</h3>
                                        <div className="flex items-center text-sm font-medium text-slate-500 mt-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mr-2 ${selectedIncident.status === 'Critical' ? 'bg-rose-100 text-rose-700' : selectedIncident.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {selectedIncident.status}
                                            </span>
                                            <Clock className="w-4 h-4 mr-1" /> {selectedIncident.time}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedIncident(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subject Identity</label>
                                            <p className="text-sm font-semibold text-slate-800 flex items-center mt-1"><Users className="w-4 h-4 mr-2 text-slate-400" /> {selectedIncident.user}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Incident Location</label>
                                            <p className="text-sm font-semibold text-slate-800 flex items-center mt-1"><Map className="w-4 h-4 mr-2 text-slate-400" /> {selectedIncident.location}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center">
                                                <Shield className="w-3 h-3 mr-1" /> Threat Assessment
                                            </label>
                                            <div className="mt-2">
                                                <div className="w-full bg-slate-200 rounded-full h-2 relative overflow-hidden">
                                                    <div className={`h-2 rounded-full ${selectedIncident.status === 'Critical' ? 'bg-rose-500 animate-pulse' : selectedIncident.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: selectedIncident.status === 'Critical' ? '85%' : selectedIncident.status === 'Resolved' ? '0%' : '45%' }} />
                                                </div>
                                                <div className="flex justify-between mt-1">
                                                    <span className="text-xs font-bold text-slate-500">{selectedIncident.status === 'Critical' ? 'Level 4' : selectedIncident.status === 'Resolved' ? 'Level 0' : 'Level 2'}</span>
                                                    <span className={`text-xs font-black ${selectedIncident.status === 'Critical' ? 'text-rose-600' : selectedIncident.status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedIncident.status === 'Critical' ? '85% CONFIDENCE' : selectedIncident.status === 'Resolved' ? 'RESOLVED' : '45% CONFIDENCE'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Automated Summary</label>
                                            <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
                                                {selectedIncident.type === "Panic Button triggered" ? "User initiated an active SOS signal. GPS tracking confirms stationary position. Nearby patrols alerted." : 
                                                 selectedIncident.type === "Route Deviation Detected" ? "Subject deviated from planned itinerary by >5km. Communication attempts pending." :
                                                 "System logged anomaly. Awaiting manual review."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3">
                                <button onClick={() => { toast.success("Establishing secure comms..."); setSelectedIncident(null); }} className="flex-1 min-w-[140px] bg-white border border-slate-200 text-slate-700 font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                                    <Phone className="w-4 h-4 mr-2" /> Call User
                                </button>
                                <button onClick={() => { toast.info("Dispatching drone to coordinates."); setSelectedIncident(null); }} className="flex-1 min-w-[140px] bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors shadow-sm">
                                    <Crosshair className="w-4 h-4 mr-2" /> Dispatch Drone
                                </button>
                                <button onClick={() => { toast.success("Incident marked as resolved."); setSelectedIncident(null); }} className="flex-1 min-w-[140px] bg-slate-900 text-white font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm">
                                    <FileText className="w-4 h-4 mr-2" /> Resolve Incident
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h2>
                    <p className="text-slate-500 text-sm mt-1">Real-time tourism safety and incident metrics.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => toast.success("Compiling latest tourism safety metrics...")}
                        className="flex items-center px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                        <Activity className="w-4 h-4 mr-2 text-brand-500" />
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Active Tourists", value: "12,482", change: "+14%", icon: Users, color: "text-blue-600", bg: "bg-blue-100", trend: "up" },
                    { title: "Active Alerts", value: "24", change: "+3%", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100", trend: "up" },
                    { title: "High-Risk Zones", value: "8", change: "-2%", icon: Map, color: "text-amber-600", bg: "bg-amber-100", trend: "down" },
                    { title: "System Health", value: "99.9%", change: "0%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-100", trend: "up" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110">
                            <stat.icon className={`w-24 h-24 ${stat.color}`} />
                        </div>
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className={`flex items-center text-sm font-semibold ${stat.trend === 'up' && stat.title !== 'Active Alerts' ? 'text-emerald-600' : stat.title === 'Active Alerts' ? 'text-rose-600' : 'text-slate-500'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                            <p className="text-3xl font-bold text-slate-800 tracking-tight mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Tourist Influx vs Alerts Triggered</h3>
                            <p className="text-sm text-slate-500 mt-1">24-hour monitoring cycle across all zones</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2">
                            <option>Today</option>
                            <option>Yesterday</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTourists" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#e11d48" fontSize={12} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 600 }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="tourists" name="Active Tourists" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTourists)" />
                                <Area yAxisId="right" type="monotone" dataKey="alerts" name="Safety Alerts" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorAlerts)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Alerts Feed */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center">
                            <BellRing className="w-5 h-5 mr-2 text-rose-500" />
                            Live Alerts Feed
                        </h3>
                        <button className="text-sm text-brand-600 font-medium hover:text-brand-700">View All</button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
                        {recentAlerts.map((alert) => (
                            <div key={alert.id} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        {alert.status === 'Critical' ? (
                                            <span className="flex h-2.5 w-2.5 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                                            </span>
                                        ) : (
                                            <span className="flex h-2.5 w-2.5 relative rounded-full bg-amber-500"></span>
                                        )}
                                        <span className={`text-xs font-bold uppercase tracking-wider ${alert.status === 'Critical' ? 'text-rose-700' : alert.status === 'Warning' ? 'text-amber-700' : 'text-slate-500'}`}>
                                            {alert.status}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">{alert.time}</span>
                                </div>
                                <h4 className="text-sm font-semibold text-slate-800">{alert.type}</h4>
                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                    <Map className="w-3 h-3 mr-1 inline" /> {alert.location}
                                </p>
                                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-medium text-slate-600">{alert.user}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedIncident(alert); }}
                                        className="text-xs bg-slate-900 text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors">
                                        Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AdvancedIntelligenceDashboard />
        </div>
    );
}
