import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, AlertTriangle, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Police Cmd', href: '/admin/police-cmd', icon: ShieldCheck },
    { name: 'Anomaly Detection', href: '/admin/anomalies', icon: AlertTriangle },
];

export default function AdminLayout() {
    const handleLogout = () => {
        signOut(auth);
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
                    <h2 className="text-lg font-semibold text-slate-800 tracking-tight ml-auto md:ml-0">Control Center</h2>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                            <span className="relative flex h-2.5 w-2.5 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">Backend Connected</span>
                        </div>
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
