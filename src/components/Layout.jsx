import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, Smartphone, AlertTriangle, Menu, UserCircle, Globe } from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Police Cmd', href: '/police-cmd', icon: ShieldCheck },
    { name: 'Anomaly Detection', href: '/anomalies', icon: AlertTriangle },
    { name: 'User Portal', href: '/user-portal', icon: UserCircle },
    { name: 'Mobile Sim', href: '/mobile-sim', icon: Smartphone },
];

export default function Layout() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 flex-shrink-0 flex-col hidden md:flex border-r border-slate-800 shadow-2xl z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md">
                    <ShieldCheck className="w-7 h-7 text-brand-500 mr-3 animate-pulse" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">SafeguardTour</h1>
                </div>
                <nav className="flex-1 py-6 px-4 space-y-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 font-semibold"
                                        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-md"></div>}
                                    <item.icon className={cn("w-5 h-5 mr-3 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800 rounded-xl p-4 flex items-center space-x-3">
                        <div className="bg-emerald-500/20 p-2 rounded-full">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">System Status</p>
                            <p className="text-sm font-semibold text-emerald-400">Secure & Active</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
                    <div className="flex items-center md:hidden">
                        <Menu className="w-6 h-6 text-slate-500 mr-3" />
                        <ShieldCheck className="w-6 h-6 text-brand-500 mr-2" />
                        <span className="font-bold text-slate-900 tracking-tight">SafeguardTour</span>
                    </div>
                    <div className="hidden md:block">
                        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Command Center</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                            <span className="relative flex h-2.5 w-2.5 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">Live Monitoring</span>
                        </div>

                        <div className="flex items-center text-slate-500 hover:text-brand-600 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
                            <Globe className="w-4 h-4 mr-2" />
                            <select className="bg-transparent text-sm font-medium outline-none cursor-pointer text-slate-700 appearance-none">
                                <option>English</option>
                                <option>हिंदी (Hindi)</option>
                                <option>বাংলা (Bengali)</option>
                                <option>মराठी (Marathi)</option>
                                <option>ಕನ್ನಡ (Kannada)</option>
                                <option>தமிழ் (Tamil)</option>
                            </select>
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                        <button className="flex items-center text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors">
                            <img src="https://i.pravatar.cc/100?img=33" alt="Admin" className="w-8 h-8 rounded-full border-2 border-slate-100 shadow-sm mr-2" />
                            <span className="hidden sm:block">Admin HQ</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
