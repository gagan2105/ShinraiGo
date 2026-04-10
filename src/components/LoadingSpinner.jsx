import { Loader2 } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl"
            >
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">{text}</p>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;
