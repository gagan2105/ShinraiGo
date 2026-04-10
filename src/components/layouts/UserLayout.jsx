import { Outlet } from "react-router-dom";

/**
 * Minimalist User Layout
 * Removes all margins, sidebars, and headers to provide a edge-to-edge 
 * immersive experience for the Mobile Portal.
 */
export default function UserLayout() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
            <main className="flex-1 w-full h-full relative">
                <Outlet />
            </main>
        </div>
    );
}
