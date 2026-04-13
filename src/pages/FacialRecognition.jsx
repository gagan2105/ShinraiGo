import { useState } from "react";
import { ScanFace, UploadCloud, Search, CheckCircle, AlertTriangle, ShieldAlert, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function FacialRecognition() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setUploadedImage(url);
            setScanResult(null);
        }
    };

    const mockDatabaseMatches = [
        { name: "Unknown Subject", match: 12, status: "Clean", bio: "No criminal records found." },
        { name: "John Doe (Alias: Phantom)", match: 98, status: "Wanted", bio: "Wanted for cyber-terrorism. Last seen in Sector 4." },
        { name: "Jane Smith", match: 85, status: "Missing", bio: "Reported missing since Oct 12. Needs immediate extraction." }
    ];

    const runNeuralScan = () => {
        if (!uploadedImage) {
            toast.error("Please provide visual input (photo) first.");
            return;
        }
        setIsScanning(true);
        setScanResult(null);

        toast.info("Neural Engine Processing...");
        
        // Mock API call to AI Facial Recognition System
        setTimeout(() => {
            setIsScanning(false);
            // Pick a random match for dramatization
            const result = mockDatabaseMatches[Math.floor(Math.random() * mockDatabaseMatches.length)];
            setScanResult(result);
            
            if (result.status === "Wanted") toast.error(`CRITICAL MATCH: ${result.name}`);
            else if (result.status === "Missing") toast.warning(`MISSING PERSON MATCH: ${result.name}`);
            else toast.success("Identity Scan completed. Clean record.");
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ScanFace className="w-24 h-24" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center tracking-tight">
                        <Cpu className="w-6 h-6 mr-3 text-indigo-400" />
                        Aegis Facial Recognition System
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">Cross-reference live visual data against federal suspect and missing person databases.</p>
                </div>
                <div className="hidden md:flex bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 items-center shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2"></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Neural DB Sync: Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                {/* Visual Input Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center">
                        <UploadCloud className="w-4 h-4 mr-2 text-indigo-500" /> Subject Visual Input
                    </h2>
                    
                    <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center relative overflow-hidden group">
                        {uploadedImage ? (
                            <>
                                <img src={uploadedImage} className="w-full h-full object-cover opacity-90" alt="subject" />
                                {/* Scanning Overlay */}
                                <AnimatePresence>
                                    {isScanning && (
                                        <motion.div 
                                            initial={{ top: '0%' }}
                                            animate={{ top: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                            className="absolute left-0 right-0 h-2 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] z-10"
                                        />
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <ScanFace className="w-16 h-16 text-slate-300 mx-auto mb-4 group-hover:text-indigo-400 transition-colors" />
                                <p className="text-sm font-bold text-slate-600">Drop subject photo here or click to upload</p>
                                <p className="text-xs text-slate-400 mt-2">Supports JPG, PNG (High Res recommended)</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileUpload} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                    </div>

                    <button 
                        onClick={runNeuralScan}
                        disabled={isScanning || !uploadedImage}
                        className="mt-4 w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 disabled:opacity-50"
                    >
                        {isScanning ? (
                            <><Cpu className="w-5 h-5 mr-2 animate-pulse" /> Running Deep Pattern Match...</>
                        ) : (
                            <><Search className="w-5 h-5 mr-2" /> Execute Federal Database Scan</>
                        )}
                    </button>
                </div>

                {/* Database Match Panel */}
                <div className="bg-slate-950 text-white rounded-2xl shadow-xl border border-slate-800 p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 relative z-10">
                        Match Results & Telemetry
                    </h2>

                    <div className="flex-1 flex flex-col justify-center relative z-10">
                        {isScanning ? (
                            <div className="flex flex-col items-center justify-center space-y-6">
                                <div className="w-20 h-20 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                                <div className="text-center font-mono text-sm tracking-widest text-indigo-400 animate-pulse">
                                    <p>QUERYING INTERPOL DB...</p>
                                    <p className="text-[10px] mt-2 opacity-50">COMPARING 4,204,192 RECORDS</p>
                                </div>
                            </div>
                        ) : scanResult ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="flex items-start justify-between border-b border-slate-800 pb-6">
                                    <div>
                                        <h3 className="text-3xl font-black tracking-tight">{scanResult.name}</h3>
                                        <p className="text-sm text-slate-400 mt-1 font-mono uppercase tracking-wider">{scanResult.status} STATUS</p>
                                    </div>
                                    <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 shadow-lg ${
                                        scanResult.match > 90 ? 'bg-rose-500/10 border-rose-500 text-rose-500' :
                                        scanResult.match > 70 ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                                        'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                    }`}>
                                        <span className="text-xl font-black">{scanResult.match}%</span>
                                        <span className="text-[8px] font-bold tracking-widest">MATCH</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className={`p-4 rounded-xl border flex items-start ${
                                        scanResult.status === 'Wanted' ? 'bg-rose-500/10 border-rose-500/50 text-rose-300' :
                                        scanResult.status === 'Missing' ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' :
                                        'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                                    }`}>
                                        {scanResult.status === 'Wanted' && <ShieldAlert className="w-5 h-5 mr-3 mt-0.5 shrink-0" />}
                                        {scanResult.status === 'Missing' && <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />}
                                        {scanResult.status === 'Clean' && <CheckCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />}
                                        <p className="text-sm font-semibold">{scanResult.bio}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Biometric Hash</p>
                                            <p className="text-xs text-slate-300 font-mono mt-1">AX-992-88B-{Math.floor(Math.random()*9000)+1000}</p>
                                        </div>
                                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Clearance Req</p>
                                            <p className="text-xs text-slate-300 font-mono mt-1">LEVEL 4 SECURE</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center opacity-30 h-full">
                                <ScanFace className="w-16 h-16 mb-4" />
                                <p className="text-sm font-bold uppercase tracking-widest">Awaiting Visual Subject Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
