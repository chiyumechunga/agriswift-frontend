import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import FarmerLayout from './components/FarmerLayout';
import Dashboard from './pages/Farmer/Dashboard';
import Records from './pages/Farmer/Records.jsx';
import Intake from './pages/Farmer/Intake';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Farmer Module */}
        <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="records" element={<Records />} />
            <Route path="intake" element={<Intake />} />
          </Route>
        </Route>

        {/* Additional modules (Depot Officer, etc.) will go here */}
      </Routes>
  );
}