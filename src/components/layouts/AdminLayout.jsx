import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, AlertTriangle, LogOut, Menu, X, UserCircle, Smartphone } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Police Cmd', href: '/admin/police-cmd', icon: ShieldCheck },
    { name: 'Digital ID', href: '/admin/digital-id', icon: ShieldCheck }, 
    { name: 'Anomaly Detection', href: '/admin/anomalies', icon: AlertTriangle },
];

export default function AdminLayout() {
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 flex-shrink-0 flex-col hidden md:flex border-r border-slate-800 shadow-2xl z-20">
                <div className="h-16 flex items-center px-6 border-b border-rose-800/50 bg-slate-900/50 backdrop-blur-md">
                    <ShieldCheck className="w-7 h-7 text-rose-500 mr-3 animate-pulse" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent tracking-tight">Safeguard Admin</h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-semibold"
                                        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={handleLogout}>
                    <div className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        System Logout
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Admin Topbar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <h2 className="text-lg font-semibold text-slate-800 tracking-tight flex-1 ml-4 md:ml-0">Control Center</h2>
                    
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                            <span className="relative flex h-2.5 w-2.5 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">System Pulse</span>
                        </div>
                    </div>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] md:hidden">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 shadow-2xl flex flex-col transition-transform animate-in slide-in-from-left duration-300">
                            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                                <span className="text-xl font-bold text-white tracking-tight">Admin Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="flex-1 py-6 px-4 space-y-2">
                                {navigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            cn(
                                                "flex items-center px-4 py-4 rounded-xl text-sm font-medium transition-all group",
                                                isActive ? "bg-rose-600 text-white" : "text-slate-400 hover:bg-slate-800"
                                            )
                                        }
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
