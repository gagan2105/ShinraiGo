import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Shield, Mail, Lock, User, UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [successAnim, setSuccessAnim] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with name
            await updateProfile(user, { displayName: name });

            // Get the ID token to authenticate with backend
            const idToken = await user.getIdToken(true);

            // Fetch role from backend to determine redirect
            const response = await axios.post("http://localhost:3000/api/auth/sync", {
                name: name
            }, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            });

            // Trigger success animation
            setSuccessAnim(true);
            toast.success("Account created successfully!");

            const role = response.data?.user?.role || "user";

            // Redirect immediately
            if (role === "admin" || role === "police") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/home");
            }

        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error.message || "Failed to create account");
            setSuccessAnim(false);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Get the ID token to authenticate with backend
            const idToken = await user.getIdToken(true);

            // Send Google user data to backend sync
            const response = await axios.post("http://localhost:3000/api/auth/sync", {
                name: user.displayName
            }, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            });

            setSuccessAnim(true);
            toast.success("Successfully logged in with Google!");

            const role = response.data?.user?.role || "user";

            // Redirect immediately
            if (role === "admin" || role === "police") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/home");
            }

        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error(error.message || "Failed to sign up with Google");
            setSuccessAnim(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Success Overlay Animation */}
            <AnimatePresence>
                {successAnim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            <CheckCircle2 className="w-24 h-24 text-indigo-500 mb-4" />
                        </motion.div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-white mb-2"
                        >
                            Account Created!
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-300 flex items-center"
                        >
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Setting up your dashboard...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`max-w-md w-full transition-all duration-500 ${successAnim ? 'scale-95 opacity-50 blur-sm' : ''}`}>
                {/* Header content */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-6 transition-transform hover:scale-110 duration-300">
                        <Shield className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-slate-400">Join Shinrai Go securely</p>
                </div>

                {/* Signup Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                    {/* Subtle animated border gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_auto] animate-shimmer pointer-events-none" />

                    <form onSubmit={handleSignup} className="space-y-5 relative z-10">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <div className="relative group/input">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within/input:text-indigo-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within/input:text-indigo-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within/input:text-indigo-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || successAnim}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2 group/btn overflow-hidden relative"
                        >
                            {/* Button subtle flash on hover */}
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />

                            {loading && !successAnim ? (
                                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                            ) : (
                                <span className="flex items-center relative z-10">
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Sign Up
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center space-x-4 relative z-10">
                        <span className="h-px w-full bg-slate-800"></span>
                        <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">or</span>
                        <span className="h-px w-full bg-slate-800"></span>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading || successAnim}
                        className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="mt-6 text-center text-slate-400 relative z-10">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-500 hover:text-indigo-400 font-medium hover:underline transition-all">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
