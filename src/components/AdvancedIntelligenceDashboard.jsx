import { useState } from 'react';
import { Clock, BrainCircuit, Users, Navigation, PlayCircle, Radio } from 'lucide-react';
import { calculateRiskContext, estimateCrowdDensity, classifyAlertNetwork, triggerMultiChannelAlert, predictFutureRisk } from '../lib/IntelligenceEngine';

export default function AdvancedIntelligenceDashboard() {
    // State simulating a connected intelligent stream
    const [streamData, setStreamData] = useState({
        inDangerZone: false,
        inactivity: 0
    });
    const [isReplaying, setIsReplaying] = useState(false);

    // AI Calculated Variables
    const riskData = calculateRiskContext(streamData.inDangerZone, streamData.inactivity);
    const crowdData = estimateCrowdDensity(riskData.score);
    const predictiveForecast = predictFutureRisk();

    // Mock Timeline from DB
    const rawEvents = [
        "10:30 PM - Panic SOS Triggered at Mall Road",
        "9:15 PM - Route Deviated significantly at Chowrasta",
        "7:00 PM - Safe Zone Exited near Hotel Elgin"
    ];

    const simulateCriticalAlert = () => {
        setStreamData({ inDangerZone: true, inactivity: 45 });
        triggerMultiChannelAlert('Panic SOS & Route Deviation', 'John Doe');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6 animate-in fade-in duration-700">
            
            {/* 1. Context-Aware Risk Engine Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><BrainCircuit className="w-24 h-24" /></div>
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                   <BrainCircuit className="w-5 h-5 mr-2 text-brand-500" />
                   AI Risk Engine
               </h3>
               
               <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                   <div className="relative w-32 h-32 flex shrink-0 items-center justify-center bg-slate-50 rounded-full border-[6px] border-slate-100 shadow-inner">
                        <div className={`absolute w-full h-full rounded-full opacity-20 animate-ping ${riskData.color}`}></div>
                        <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center ${riskData.color} text-white shadow-lg`}>
                            <span className="font-bold text-sm tracking-wide text-center leading-tight">
                                {riskData.level}
                            </span>
                        </div>
                   </div>
                   
                   <div className="space-y-4 w-full">
                       <div>
                           <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Engine Confidence</p>
                           <div className="flex items-center mt-1">
                               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-brand-500" style={{ width: `${riskData.confidence}%` }}></div>
                               </div>
                               <span className="ml-3 text-sm font-bold text-slate-700">{riskData.confidence}%</span>
                           </div>
                       </div>
                       
                       {/* 4. Crowd Density Integration */}
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <div className="flex justify-between items-center mb-1">
                               <span className="text-xs text-slate-500 flex items-center"><Users className="w-3 h-3 mr-1" /> Est. Crowd Density</span>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${crowdData.type === 'safe' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{crowdData.label}</span>
                           </div>
                           <p className="text-sm font-semibold text-slate-800">{crowdData.value}</p>
                       </div>
                   </div>
               </div>
            </div>

            {/* 5. Intelligent Alert Classification Timeline */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                    <span>Incident Classification</span>
                    <button onClick={simulateCriticalAlert} className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-full transition-colors flex items-center">
                        <Radio className="w-3 h-3 mr-1" /> Force Alert
                    </button>
                </h3>
                
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                    {rawEvents.map((rawText, index) => {
                        const parsed = classifyAlertNetwork(rawText);
                        const parts = rawText.split(" - ");
                        
                        return (
                        <div key={index} className="relative pl-6">
                            <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-[3px] border-white shadow-sm ${parsed.severity === 'Critical' ? 'bg-rose-500 animate-pulse' : parsed.severity === 'Warning' ? 'bg-amber-500' : 'bg-brand-500'}`}></div>
                            
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <h4 className="text-sm font-bold text-slate-800">{parsed.tag}</h4>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${parsed.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {parsed.action}
                                    </span>
                                </div>
                                <div className="flex items-center text-xs text-slate-500 mt-2 space-x-3">
                                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-slate-400" /> {parts[0]}</span>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>

            {/* 6. Geo-Spatial Intel & Replay Simulator Control */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden xl:col-span-1 md:col-span-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full"></div>
                
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center mb-2">
                        <Navigation className="w-5 h-5 mr-2 text-brand-400" />
                        Geospatial Layer Control
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">Connects to the main map interface to project safe zones, intelligence markers, and historical paths.</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-xs font-semibold">Active Responders</span>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl flex items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                            <span className="text-xs font-semibold">Verified Safe Havens</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
                            <PlayCircle className="w-4 h-4 mr-1.5" /> Incident Replay
                        </span>
                        <span className="text-xs text-brand-400 font-mono">{isReplaying ? "PLAYING..." : "PAUSED"}</span>
                    </div>
                    
                    <input 
                       type="range" 
                       min="0" max="100" 
                       defaultValue="0"
                       className="w-full mb-3 accent-brand-500 cursor-pointer" 
                       onChange={() => setIsReplaying(true)}
                       onMouseUp={() => setIsReplaying(false)}
                    />
                    
                    <p className="text-[10px] text-slate-500">Scrub timeline to replay user GPS trajectory leading up to an incident. View triggers mapped against safe infrastructure.</p>
                </div>
            </div>

            {/* 7. Predictive AI Risk Forecasting Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 xl:col-span-1 md:col-span-1">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                    AI Predictive Forecast (24h)
                </h3>
                
                <div className="space-y-4">
                    {predictiveForecast.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group cursor-default">
                            <div className="flex items-center">
                                <span className="text-xs font-bold text-slate-500 w-12">{item.time}</span>
                                <div className="ml-4 flex items-center">
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-3">
                                        <div 
                                            className={`h-full ${item.level === 'High' ? 'bg-rose-500' : item.level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${item.level === 'High' ? 'text-rose-600' : item.level === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {item.level}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Acc: 89%
                            </span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 border-dashed">
                    <p className="text-[10px] text-indigo-700 leading-relaxed italic">
                        "Proprietary safety model predicting peak risk at late-night intervals based on historical incident density and environmental factors."
                    </p>
                </div>
            </div>

        </div>
    );
}
