import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Ghost, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-brand-500 blur-[120px] rounded-full animate-pulse" />
            </div>

            <div className="max-w-md w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 mb-8 shadow-2xl">
                        <Ghost className="w-12 h-12 text-brand-500 animate-bounce" />
                    </div>
                    
                    <h1 className="text-8xl font-black text-white mb-4 tracking-tighter">404</h1>
                    <h2 className="text-2xl font-bold text-slate-200 mb-6 tracking-tight">Protocol Terminated.</h2>
                    <p className="text-slate-500 mb-10 leading-relaxed">
                        The resource you are searching for does not exist in our neural substrate. You may have strayed beyond the safety perimeter.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/" 
                            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-brand-500/20"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Safety Home
                        </Link>
                        <button 
                            onClick={() => window.history.back()}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl border border-slate-800 flex items-center justify-center transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Neural Backtrack
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
