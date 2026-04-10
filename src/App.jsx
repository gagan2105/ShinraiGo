import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigationbar';
import { Capacitor } from '@capacitor/core';

// Core Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import AuthGateway from "./components/AuthGateway";

// Components
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import UserLayout from "./components/layouts/UserLayout";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import DigitalID from "./pages/DigitalID";
import AnomalyDetection from "./pages/AnomalyDetection";

// User Pages
import UserPortal from "./pages/UserPortal";
import MobileAppSimulator from "./pages/MobileAppSimulator";
import CompanionTracker from "./pages/CompanionTracker";
import NotFound from "./pages/NotFound";

function App() {
  
  useEffect(() => {
    // Mobile UI Optimizations
    const setupNativeUI = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Set Status Bar to transparent/dark to match the app theme
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#020617' }); // slate-950
          
          // Set Navigation Bar (Bottom) to match theme
          if (Capacitor.getPlatform() === 'android') {
            await NavigationBar.setColor({ color: '#020617' });
          }
        } catch (e) {
          console.warn("Native UI setup failed", e);
        }
      }
    };
    
    setupNativeUI();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          theme="dark" 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid #1e293b',
              borderRadius: '16px',
            },
          }}
        />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Landing />} />
            <Route path="/auth-status" element={<AuthGateway />} />

            <Route path="/user" element={<RoleProtectedRoute allowedRoles={["user", "admin", "police"]} />}>
              <Route element={<UserLayout />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<UserPortal />} />
                <Route path="mobile-sim" element={<MobileAppSimulator />} />
              </Route>
            </Route>

            <Route path="/admin" element={<RoleProtectedRoute allowedRoles={["admin", "police"]} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="police-cmd" element={<PoliceDashboard />} />
                <Route path="digital-id" element={<DigitalID />} />
                <Route path="anomalies" element={<AnomalyDetection />} />
              </Route>
            </Route>

            <Route path="/track/:userId" element={<CompanionTracker />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
