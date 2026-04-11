import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Shield, Mail, Lock, User, UserPlus, Loader2, CheckCircle2, Globe, Zap, Bell, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ENDPOINTS } from "../lib/api";

import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [successAnim, setSuccessAnim] = useState(false);
    const navigate = useNavigate();
    const { currentUser, userRole, logout } = useAuth();

    useEffect(() => {
        if (currentUser && userRole) {
            if (currentUser.isDummy) {
                logout();
            } else {
                if (userRole === "admin" || userRole === "police") navigate("/admin/police-cmd");
                else navigate("/user/home");
            }
        }
    }, [currentUser, userRole, navigate, logout]);

    useEffect(() => {
        const checkRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    setLoading(true);
                    const user = result.user;
                    toast.success("Identity verified via Google!");
                    setSuccessAnim(true);
                    
                    const idToken = await user.getIdToken(true);
                    try {
                        const response = await axios.post(ENDPOINTS.SYNC, { name: user.displayName }, {
                            headers: { Authorization: `Bearer ${idToken}` },
                            timeout: 8000
                        });
                        
                        const isNew = response.data?.isNewUser;
                        const role = response.data?.user?.role || "user";

                        setTimeout(() => {
                            if (isNew) navigate("/onboarding");
                            else if (role === "admin" || role === "police") navigate("/admin/police-cmd");
                            else navigate("/user/home");
                        }, 1500);
                    } catch (e) {
                        navigate("/onboarding");
                    }
                }
            } catch (error) {
                console.error("Signup Redirect Error:", error);
            }
        };
        checkRedirect();
    }, [navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken(true);

            try {
                const response = await axios.post(ENDPOINTS.SYNC, {}, {
                    headers: { Authorization: `Bearer ${idToken}` },
                    timeout: 8000
                });
                
                setSuccessAnim(true);
                toast.success("Authenticating session...");
                
                const isNew = response.data?.isNewUser;
                const role = response.data?.user?.role || "user";

                setTimeout(() => {
                    if (isNew) navigate("/onboarding");
                    else if (role === "admin" || role === "police") navigate("/admin/police-cmd");
                    else navigate("/user/home");
                }, 1500);
            } catch (syncErr) {
                setSuccessAnim(true);
                setTimeout(() => navigate("/onboarding"), 1500);
            }
        } catch (error) {
            toast.error(error.message || "Enrollment failed");
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            toast.success("Identity verified via Google!");
            setSuccessAnim(true);
            
            const idToken = await user.getIdToken(true);
            try {
                const response = await axios.post(ENDPOINTS.SYNC, { name: user.displayName }, {
                    headers: { Authorization: `Bearer ${idToken}` },
                    timeout: 8000
                });
                
                const isNew = response.data?.isNewUser;
                const role = response.data?.user?.role || "user";

                setTimeout(() => {
                    if (isNew) navigate("/onboarding");
                    else if (role === "admin" || role === "police") navigate("/admin/police-cmd");
                    else navigate("/user/home");
                }, 1500);
            } catch (e) {
                navigate("/onboarding");
            }
        } catch (error) {
            console.error("Google Signup Error:", error);
            toast.error(error.message || "Google Authentication failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden">
            
            {/* Success Overlay */}
            <AnimatePresence>
                {successAnim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="w-24 h-24 bg-brand-500 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(79,70,229,0.5)]"
                        >
                            <ShieldCheck className="w-12 h-12 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">AUTHENTICATED</h2>
                        <p className="text-slate-400 flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Initializing secure link...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Panel: Marketing/Identity */}
            <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-slate-900 relative p-16 flex-col justify-between border-r border-slate-800">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)] blur-[120px]" />
                </div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center space-x-3 mb-20 group">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-brand-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter italic">SHINRAI GO</span>
                    </Link>

                    <h1 className="text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                        Start your <span className="text-brand-500">Journey</span> with confidence.
                    </h1>
                    
                    <div className="space-y-8 mt-12">
                        <FeaturePoint 
                            icon={<Zap className="w-5 h-5 text-amber-400" />}
                            title="Quick Initialization"
                            desc="Fast-track enrollment with neural identity sync."
                        />
                        <FeaturePoint 
                            icon={<Globe className="w-5 h-5 text-indigo-400" />}
                            title="Universal Shield"
                            desc="Connect to global safety nodes in seconds."
                        />
                    </div>
                </div>

                <div className="relative z-10 pt-10 border-t border-slate-800">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Encryption Level</p>
                    <div className="flex items-center space-x-6">
                         <span className="text-emerald-500 font-black text-xs tracking-widest">AES-256 BIT</span>
                         <span className="text-emerald-500 font-black text-xs tracking-widest">ZERO TRUST</span>
                    </div>
                </div>
            </div>

            {/* Right Panel: Form */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16">
                <div className="max-w-md w-full">
                    <div className="md:hidden flex items-center justify-center mb-12">
                        <Shield className="w-10 h-10 text-brand-500" />
                    </div>
                    
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Sign Up.</h2>
                        <p className="text-slate-500">Initialize your secure account to continue.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <InputField 
                            label="Email Address" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="name@example.com" 
                            icon={<Mail className="w-5 h-5" />} 
                        />
                        <InputField 
                            label="Security Password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••" 
                            icon={<Lock className="w-5 h-5" />} 
                        />

                        <button
                            type="submit"
                            disabled={loading || successAnim}
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-2xl flex items-center justify-center border-none transition-all shadow-xl shadow-brand-500/20 disabled:opacity-50 mt-6 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            {loading && !successAnim ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <span className="flex items-center group-hover:scale-105 transition-transform">
                                    <UserPlus className="w-5 h-5 mr-3" />
                                    Secure Enrollment
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center space-x-4">
                        <span className="h-px bg-slate-800 flex-1" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">identity sync</span>
                        <span className="h-px bg-slate-800 flex-1" />
                    </div>

                    <button
                        onClick={handleGoogleSignup}
                        className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center border border-slate-800 transition-all hover:border-slate-700"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Join via Google
                    </button>

                    <p className="mt-10 text-center text-slate-500 text-sm">
                        Access existing account?{" "}
                        <Link to="/login" className="text-brand-500 font-bold hover:underline">Sign In Protocol</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

function FeaturePoint({ icon, title, desc }) {
    return (
        <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                {icon}
            </div>
            <div>
                <h4 className="text-white font-bold text-sm tracking-tight">{title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">{desc}</p>
            </div>
        </div>
    );
}

function InputField({ label, type, value, onChange, placeholder, icon }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-500 transition-colors">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all hover:bg-slate-900"
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    );
}

export default Signup;
