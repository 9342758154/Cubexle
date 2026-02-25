import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import OVPanel from "@/components/Datapanel/OVPanel";
import DiagnosticsPanel from "@/components/Datapanel/DiagnosticsPanel";
import LabsPanel from "@/components/Datapanel/LabsPanel";
import EKGPanel from "@/components/Datapanel/EKGPanel";
import AdminPage from './pages/AdminPage';
import ReportPage from './pages/ReportPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ov" element={<OVPanel />} />
        <Route path="/diagnostics" element={<DiagnosticsPanel />} />
        <Route path="/labs" element={<LabsPanel />} />
        <Route path="/ekg" element={<EKGPanel />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;