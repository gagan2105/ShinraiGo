import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Globe, Zap, Heart, Eye, ArrowRight, MapPin, Navigation, CheckCircle2, Smartphone, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
    const { currentUser, userRole, logout } = useAuth();
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-brand-500/30 overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">SHINRAI <span className="text-brand-500">GO</span></span>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Safety Logic</a>
                        <a href="#intelligence" className="hover:text-white transition-colors">Intelligence Hub</a>
                        <a href="#trust" className="hover:text-white transition-colors">Authority Connect</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <Link 
                                    to={userRole === 'admin' || userRole === 'police' ? "/admin/police-cmd" : "/user/home"} 
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Live Portal Access
                                </Link>
                                <button 
                                    onClick={async () => {
                                        if (window.confirm("Are you sure you want to log out?")) {
                                            await logout();
                                            window.location.reload();
                                        }
                                    }}
                                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
                            >
                                Enter Platform
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-500/5 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Zap className="w-3 h-3" />
                            <span>V-3.0 Intelligence Pulse Active</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1]">
                            The Future of <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Tourist Safety</span> is Here.
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Shinrai Go uses advanced context-aware risk intelligence and satellite tracking to ensure every traveler stays protected, anywhere on Earth.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                to="/signup" 
                                className="w-full sm:w-auto px-10 py-4 bg-white text-slate-950 font-black rounded-2xl flex items-center justify-center group hover:scale-105 transition-transform"
                            >
                                Secure Your Journey
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                to="/demo" 
                                className="w-full sm:w-auto px-10 py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors flex items-center justify-center group"
                            >
                                <Zap className="mr-2 w-5 h-5 text-amber-500 group-hover:animate-pulse" />
                                Review Trust Protocols (Demo)
                            </Link>
                        </div>

                        {/* Dummy Access Quick Links */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 w-full mb-2">Prototype Quick Access</p>
                            <Link to="/demo" className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-rose-500 hover:bg-slate-800 transition-colors flex items-center">
                                <Shield className="w-3 h-3 mr-2" /> Admin Portal
                            </Link>
                            <button onClick={() => window.location.href='/demo'} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-blue-500 hover:bg-slate-800 transition-colors flex items-center">
                                <Globe className="w-3 h-3 mr-2" /> Police Cmd
                            </button>
                            <button onClick={() => window.location.href='/login'} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-emerald-500 hover:bg-slate-800 transition-colors flex items-center">
                                <Navigation className="w-3 h-3 mr-2" /> Tourist Gate
                            </button>
                        </div>
                    </motion.div>

                    {/* App Mockup Preview */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-24 relative"
                    >
                        <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full transform scale-75" />
                        <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                            <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center border border-slate-800 relative group overflow-hidden">
                                <Navigation className="w-20 h-20 text-brand-500/20 animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-10 left-10 text-left">
                                    <div className="mb-2 w-20 h-1.5 bg-brand-500 rounded-full" />
                                    <p className="text-2xl font-black text-white">Live Tracking Hub</p>
                                    <p className="text-slate-400 text-sm">Real-time geospatial safety monitoring</p>
                                </div>
                                <div className="absolute top-10 right-10 flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                    <p className="text-[10px] font-black uppercase text-rose-500">Live Anomaly Feed</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Badges / Partners */}
            <div className="py-12 border-y border-slate-900 bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-6 overflow-hidden">
                    <p className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-slate-600 mb-8">Integrated with Global Response Authorities</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        <PartnerLogo name="UN Tourism" />
                        <PartnerLogo name="Digital India" />
                        <PartnerLogo name="Google Cloud" />
                        <PartnerLogo name="IATA" />
                        <PartnerLogo name="Microsoft for Startups" />
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatItem value="150K+" label="Active Travelers" />
                        <StatItem value="1.2s" label="Response Latency" />
                        <StatItem value="45" label="Countries Covered" />
                        <StatItem value="Zero" label="Security Breach" />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 relative">
                 <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Select your Protection Tier.</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Choose the level of AI oversight that matches your travel risk profile.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard 
                            name="Leisure"
                            price="Free"
                            features={["Standard Tracking", "Community Alerts", "Digital ID Minting", "Email Support"]}
                        />
                        <PricingCard 
                            name="Voyager"
                            price="$9.99/mo"
                            highlighted={true}
                            features={["Neural Anomaly Detection", "Geofence Guard", "Police Command Link", "24/7 Priority Support"]}
                        />
                        <PricingCard 
                            name="Executive"
                            price="$29.99/mo"
                            features={["Satellite Offline Link", "Auto E-FIR Filing", "Private Response Sync", "Global Insurance Integration"]}
                        />
                    </div>
                 </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 bg-slate-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Trusted by Conscious Travelers.</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">See how Shinrai Go is redefining the safety expectations of global citizens.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TestimonialCard 
                            quote="The geofence alerts saved me from wandering into a restricted zone during my solo trek in Ladakh. Absolutely essential."
                            author="Sarah Jenkins"
                            role="Solo Backpacker"
                            avatar="https://i.pravatar.cc/150?img=32"
                        />
                        <TestimonialCard 
                            quote="Finally, an app that actually connects to authorities in real-time. The Digital ID system made border crossing seamless."
                            author="David Chen"
                            role="Digital Nomad"
                            avatar="https://i.pravatar.cc/150?img=12"
                        />
                    </div>
                </div>
            </section>

            {/* App Store Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-600/5 backdrop-blur-3xl" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-slate-900 rounded-[3rem] border border-slate-800 p-12 md:p-20 flex flex-col items-center text-center shadow-3xl">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to Guard your Journey?</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mb-12">Download the Shinrai Go Mobile app and join 150,000+ protected travelers worldwide.</p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <StoreBadge platform="Apple App Store" />
                            <StoreBadge platform="Google Play Store" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategy Section */}
            <section id="features" className="py-32 bg-slate-950 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Uncompromising Protocols.</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Our security substrate is built on three core pillars of generative intelligence and physical authority.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard 
                            icon={<Globe className="w-8 h-8 text-indigo-400" />}
                            title="Global Presence"
                            desc="Satellite linkage ensures protection even in remote altitudes where standard networks fail."
                        />
                        <FeatureCard 
                            icon={<Zap className="w-8 h-8 text-brand-400" />}
                            title="Predictive AI"
                            desc="Anomaly detection engines forecast potential threats before they manifest in your proximity."
                        />
                        <FeatureCard 
                            icon={<Heart className="w-8 h-8 text-rose-400" />}
                            title="Authority Trust"
                            desc="Bi-directional bridge to police command centers for instant deployment during SOS triggers."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-900 py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center space-x-3 mb-4">
                            <Shield className="w-6 h-6 text-brand-500" />
                            <span className="text-xl font-bold text-white">SHINRAI GO</span>
                        </div>
                        <p className="text-slate-500 text-sm">Empowering every journey with unyielding security.</p>
                    </div>
                    <div className="flex space-x-10 text-sm font-medium text-slate-400">
                        <a href="#" className="hover:text-white">Security Patch Notes</a>
                        <a href="#" className="hover:text-white">API Documentation</a>
                        <Link to="/admin/police-cmd" className="hover:text-brand-500 font-bold transition-colors">Command Center Login</Link>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-900 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                    © 2026 Shinrai Safety Labs. All Neural Protocols Reserved.
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/30 transition-all group"
        >
            <div className="mb-6 p-4 bg-slate-950 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
        </motion.div>
    );
}

function StatItem({ value, label }) {
    return (
        <div className="text-center p-6 bg-slate-900/20 border border-slate-800/50 rounded-2xl backdrop-blur-sm">
            <h4 className="text-3xl font-black text-white mb-1 tracking-tighter">{value}</h4>
            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-500">{label}</p>
        </div>
    );
}

function PartnerLogo({ name }) {
    return (
        <span className="text-white font-black text-xl tracking-tighter filter grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all cursor-default">{name}</span>
    );
}

function PricingCard({ name, price, features, highlighted = false }) {
    return (
        <div className={`p-10 rounded-[2.5rem] border ${highlighted ? 'bg-slate-900 border-brand-500 shadow-2xl shadow-brand-500/10' : 'bg-slate-900/40 border-slate-800'} relative overflow-hidden group`}>
            {highlighted && <div className="absolute top-0 right-0 py-1.5 px-6 bg-brand-600 text-[10px] font-black uppercase text-white tracking-widest rounded-bl-2xl">Recommended</div>}
            <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
            <div className="flex items-baseline mb-8">
                <span className="text-4xl font-black text-white">{price}</span>
                {price !== 'Free' && <span className="text-slate-500 ml-1 text-sm font-bold">/month</span>}
            </div>
            <ul className="space-y-4 mb-10">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 mr-3 shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>
            <Link 
                to="/signup" 
                className={`w-full py-4 rounded-2xl font-black text-center transition-all ${highlighted ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-800 text-white hover:bg-slate-700 block'}`}
            >
                Start Guarding
            </Link>
        </div>
    );
}

function TestimonialCard({ quote, author, role, avatar }) {
    return (
        <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative">
            <div className="text-brand-500 mb-6 drop-shadow-glow">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                ))}
            </div>
            <p className="text-slate-300 italic mb-8 leading-relaxed">"{quote}"</p>
            <div className="flex items-center">
                <img src={avatar} alt={author} className="w-12 h-12 rounded-full border-2 border-slate-700 mr-4" />
                <div>
                    <h5 className="font-bold text-white text-sm">{author}</h5>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{role}</p>
                </div>
            </div>
        </div>
    );
}

function StoreBadge({ platform }) {
    return (
        <div className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-2xl flex items-center group cursor-pointer hover:bg-slate-700 transition-all hover:-translate-y-1">
            <div className={`w-8 h-8 ${platform.includes('Apple') ? 'bg-white text-black' : 'bg-brand-500 text-white'} rounded flex items-center justify-center mr-4`}>
                <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-left">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Available on</p>
                <p className="text-lg font-black text-white leading-none">{platform}</p>
            </div>
        </div>
    );
}
