import { Outlet, NavLink } from "react-router-dom";
import { UserCircle, Smartphone, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const navigation = [
    { name: 'Portal Home', href: '/user/home', icon: UserCircle },
    { name: 'Mobile Simulator', href: '/user/mobile-sim', icon: Smartphone },
];

export default function UserLayout() {
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 flex-shrink-0 flex-col hidden md:flex border-r border-slate-800 shadow-2xl z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md">
                    <UserCircle className="w-7 h-7 text-indigo-400 mr-3" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent tracking-tight">Safeguard User</h1>
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
                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={handleLogout}>
                    <div className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300">
                        <LogOut className="w-5 h-5 mr-3" />
                        Log Out
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
