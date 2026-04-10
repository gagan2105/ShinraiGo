import { useState } from "react";
import { QrCode, Shield, MapPin, Phone, User, PlusCircle, CheckCircle2 } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { ENDPOINTS } from "../lib/api";

export default function DigitalID() {
    const [formData, setFormData] = useState({
        name: "John Doe",
        idNumber: "AADHAAR-8291-3311-XXXX",
        nationality: "Indian",
        phone: "+91 98765 43210",
        emergencyContact: "+91 91234 56789",
        bloodGroup: "O+",
        destination: "Leh, Ladakh",
        duration: "14 Days",
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);

        try {
            const response = await fetch(ENDPOINTS.DIGITAL_ID_MINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to generate ID');

            const data = await response.json();

            // The server returns a 'document' object with the final minted data
            if (data.document) {
                setFormData(data.document);
            }

            setIsGenerated(true);
            toast.success("Identity successfully minted to Blockchain.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to connect to the minting node.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tourist Digital ID Platform</h2>
                <p className="text-slate-500 text-sm mt-1">Generate a secure, blockchain-verified digital identity for visitors.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Registration */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <form onSubmit={handleGenerate}>
                        <div className="space-y-6">
                            {/* KYC Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-brand-500" /> API KYC Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 bg-slate-50 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">ID Number (Aadhaar/Passport)</label>
                                        <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 bg-slate-50 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Nationality</label>
                                        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 bg-slate-50 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Blood Group</label>
                                        <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 bg-slate-50 border" />
                                    </div>
                                </div>
                            </div>

                            {/* Itinerary */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4 mt-6 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-brand-500" /> Travel Itinerary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Primary Destination</label>
                                        <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 bg-slate-50 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Duration of Stay</label>
                                        <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 bg-slate-50 border" />
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contacts */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4 mt-6 flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-brand-500" /> Support & Contacts
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Tourist Phone</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 bg-slate-50 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Emergency Contact</label>
                                        <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full text-sm border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 bg-slate-50 border" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isGenerating || isGenerated}
                                className={`w-full flex items-center justify-center p-3 text-sm font-semibold text-white rounded-xl transition-all ${isGenerated ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/25 shadow-lg'
                                    }`}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div> Minting to Blockchain...</span>
                                ) : isGenerated ? (
                                    <span className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" /> ID Generated Successfully</span>
                                ) : (
                                    <span className="flex items-center"><PlusCircle className="w-5 h-5 mr-2" /> Generate Secure Digital ID</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-5 flex justify-center items-start pt-6 lg:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`w-full max-w-sm rounded-4xl p-6 text-white relative overflow-hidden transition-all duration-500 ${isGenerated ? 'bg-gradient-to-br from-emerald-600 to-teal-800 shadow-xl shadow-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-br from-slate-900 to-indigo-950 shadow-2xl shadow-indigo-500/10'}`}
                    >
                        {/* Decals & Accents */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>
                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center z-10">
                            <Shield className={`w-3 h-3 mr-1 ${isGenerated ? 'text-emerald-300' : 'text-slate-300'}`} />
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-white/90">
                                {isGenerated ? 'Blockchain Verified' : 'Draft ID'}
                            </span>
                        </div>

                        <div className="relative z-10 p-2">
                            <div className="flex items-center mb-8">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mr-4">
                                    <User className="text-white/80 w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl tracking-wide">{formData.name || 'Tourist Name'}</h4>
                                    <p className="text-xs text-brand-200 mt-0.5">{formData.nationality || 'Nationality'}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-brand-200/70 uppercase tracking-widest font-semibold mb-1">ID Number</p>
                                        <p className="text-sm font-medium bg-white/5 rounded px-2 py-1 -mx-2">{formData.idNumber || 'Pending'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-brand-200/70 uppercase tracking-widest font-semibold mb-1">Blood Group</p>
                                        <p className="text-sm font-medium">{formData.bloodGroup || 'Pending'}</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-white/10">
                                    <p className="text-[10px] text-brand-200/70 uppercase tracking-widest font-semibold mb-1">Destination</p>
                                    <p className="text-sm font-medium flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 hidden sm:inline" /> {formData.destination || 'Pending'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] text-brand-200/70 uppercase tracking-widest font-semibold mb-1">Valid Until</p>
                                        <p className="text-sm font-medium">{formData.duration || 'Pending'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-brand-200/70 uppercase tracking-widest font-semibold mb-1">Emergency SOS</p>
                                        <p className="text-sm font-medium">{formData.emergencyContact || 'Pending'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center items-center bg-white p-3 rounded-xl mx-auto w-32 shadow-inner">
                                {isGenerated && formData.qrData ? (
                                    <QRCodeCanvas
                                        value={formData.qrData}
                                        size={104}
                                        bgColor={"#ffffff"}
                                        fgColor={"#1e293b"}
                                        level={"M"}
                                        includeMargin={false}
                                        className="animate-in zoom-in duration-300"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-slate-100 rounded flex items-center justify-center flex-col border border-dashed border-slate-300">
                                        <QrCode className="w-6 h-6 text-slate-300 mb-1" />
                                        <span className="text-[8px] text-slate-400 font-medium">Pending Gen</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-[10px] text-white/50 mt-4 tracking-widest uppercase">{formData.id || 'ID-PENDING'}</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Blockchain Evidence Ledger */}
            <div className="mt-12 bg-slate-900 rounded-4xl p-8 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Shield className="w-48 h-48 text-brand-500" /></div>
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center relative z-10">
                    <div className="p-2 bg-brand-500/20 rounded-lg mr-3">
                        <Shield className="w-5 h-5 text-brand-400" />
                    </div>
                    Blockchain Evidence Ledger
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {[
                        { event: 'Identity Minted', hash: '0x8821...3311', timestamp: '2 mins ago', status: 'Confirmed' },
                        { event: 'KYC Verified', hash: '0x4421...9912', timestamp: '5 mins ago', status: 'Verified' },
                        { event: 'Contract Deployed', hash: '0x1102...8832', timestamp: '10 mins ago', status: 'Success' },
                    ].map((log, i) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl hover:bg-slate-800 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${log.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-500/20 text-brand-400'}`}>
                                    {log.status}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">{log.timestamp}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-200 mb-2">{log.event}</h4>
                            <div className="flex items-center text-[10px] font-mono text-slate-500 bg-black/30 p-2 rounded truncate group-hover:text-slate-300 transition-colors">
                                Hash: {log.hash}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 italic">"All safety events and identity snapshots are hashed and stored on a decentralized ledger to prevent record tampering during critical investigations."</p>
                    <button className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center shrink-0">
                        View on Explorer <PlusCircle className="w-3 h-3 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
