import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Shield, CheckCircle2, ArrowRight, HeartPulse, CreditCard, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import axios from "axios";
import { ENDPOINTS } from "../lib/api";

export default function Onboarding() {
    const navigate = useNavigate();
    const { currentUser, setIsOnboarded } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: currentUser?.displayName || "",
        phone: "",
        emergencyContact: "",
        bloodGroup: "",
        nationality: "",
        idType: "Aadhaar",
        idNumber: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step === 1 && (!formData.fullName || !formData.phone)) {
            toast.error("Please fill in basic details");
            return;
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let idToken;
            if (currentUser?.isDummy) {
                idToken = "DUMMY_USER_TOKEN";
            } else {
                idToken = await auth.currentUser?.getIdToken();
            }

            await axios.put(ENDPOINTS.PROFILE_UPDATE || "/api/auth/profile", formData, {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            setIsOnboarded(true);
            toast.success("Profile setup complete! Welcome to ShinraiGo.");
            setTimeout(() => navigate("/user/home"), 1500);
        } catch (error) {
            console.error("Onboarding Error:", error);
            toast.error("Failed to save profile. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
            {/* Background Decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-xl relative z-10">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 mb-4">
                        <Shield className="w-8 h-8 text-brand-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Complete Your Profile</h1>
                    <p className="text-slate-500 mt-2">Help us keep you safe by providing your details.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 px-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                step >= s ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                            </div>
                            {s < 3 && (
                                <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-500 ${
                                    step > s ? 'bg-brand-600' : 'bg-slate-200'
                                }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center">
                                        <User className="w-4 h-4 mr-2 text-brand-500" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-brand-500" /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-800"
                                    />
                                </div>
                                <button
                                    onClick={nextStep}
                                    className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center group hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                                >
                                    Continue <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-rose-500" /> Emergency Contact
                                    </label>
                                    <input
                                        type="tel"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        placeholder="Emergency contact number"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center">
                                        <HeartPulse className="w-4 h-4 mr-2 text-rose-500" /> Blood Group
                                    </label>
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-800 appearance-none"
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">Back</button>
                                    <button
                                        onClick={nextStep}
                                        className="flex-[2] bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center group hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                                    >
                                        Next <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-brand-500" /> Nationality
                                    </label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="e.g. Indian"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center">
                                        <CreditCard className="w-4 h-4 mr-2 text-brand-500" /> ID Document (Aadhaar/Passport)
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        {['Aadhaar', 'Passport', 'Voter ID'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({...formData, idType: type})}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                                    formData.idType === type 
                                                    ? 'bg-brand-50 border-brand-200 text-brand-600' 
                                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        name="idNumber"
                                        value={formData.idNumber}
                                        onChange={handleChange}
                                        placeholder={`Enter ${formData.idType} Number`}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-800 font-mono tracking-wider"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">Back</button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-[2] bg-brand-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center group hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
                                    >
                                        Complete Setup <CheckCircle2 className="w-5 h-5 ml-2" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-center text-slate-400 text-xs mt-8">
                    Your data is securely hashed and stored on the ShinraiGo blockchain network.
                    <br />By continuing, you agree to our emergency protocols.
                </p>
            </div>
        </div>
    );
}
