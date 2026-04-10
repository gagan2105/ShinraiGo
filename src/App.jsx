import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

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
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster theme="dark" position="top-right" />
        <AnimatePresence mode="wait">
          <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Root Path now takes you to the stunning Landing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth-status" element={<AuthGateway />} />

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

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/track/:userId" element={<CompanionTracker />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AnimatePresence>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
