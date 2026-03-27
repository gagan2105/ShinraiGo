import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

// Core Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster theme="dark" position="top-right" />
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Root Gateway determines where a logged in user should land first */}
          <Route path="/" element={<AuthGateway />} />

          {/* ================= USER ROUTES ================= */}
          <Route path="/user" element={<RoleProtectedRoute allowedRoles={["user", "admin", "police"]} />}>
            <Route element={<UserLayout />}>
              {/* Default User Route */}
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<UserPortal />} />
              <Route path="mobile-sim" element={<MobileAppSimulator />} />
              {/* Note: Profile Page logic would go here according to user spec */}
            </Route>
          </Route>

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={["admin", "police"]} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="police-cmd" element={<PoliceDashboard />} />
              <Route path="digital-id" element={<DigitalID />} />
              <Route path="anomalies" element={<AnomalyDetection />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
