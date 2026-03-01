import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import DigitalID from "./pages/DigitalID";
import AnomalyDetection from "./pages/AnomalyDetection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="police-cmd" element={<PoliceDashboard />} />
          <Route path="digital-id" element={<DigitalID />} />
          <Route path="anomalies" element={<AnomalyDetection />} />
          <Route path="*" element={<div className="p-8">Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
