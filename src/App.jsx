// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import FarmerLayout from './components/FarmerLayout.jsx';

import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

import FarmerDashboard from './pages/Farmer/FarmerDashboard.jsx';
import Records from './pages/Farmer/Records.jsx';
import ReceiptPage from './pages/Farmer/ReceiptPage.jsx';

import FRALayout from './pages/FRA/FRALayout.jsx';
import FRADashboard from './pages/FRA/FRADashboard.jsx';
import CropIntake from './pages/FRA/CropIntake.jsx';
import AssistRegistration from './pages/FRA/AssistRegistration.jsx';

import MinisterialDashboard from './pages/Ministerial/MinisterialDashboard.jsx';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function ExecutiveShell({ badgeText, badgeColor }) {
    const { user, logout } = useAuth();
    return (
        <div className="agri-landing" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="agri-header">
                <div className="agri-container agri-nav">
                    <Link to="/" className="agri-brand">
                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>agriculture</span>
                        <span>AgriSwift</span>
                        <span className="agri-pill-badge" style={{ backgroundColor: badgeColor, color: '#fff', marginLeft: '8px' }}>
                            {badgeText}
                        </span>
                    </Link>
                    <div className="agri-nav-actions">
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--agri-text-muted)' }}>
                            {user?.name || 'Authorized User'}
                        </span>
                        <button onClick={logout} className="agri-btn agri-btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>
            <main className="agri-container" style={{ padding: '32px 24px', flex: 1 }}>
                <Outlet />
            </main>
            <footer className="agri-footer">
                <div className="agri-container agri-footer-inner">
                    <div>AgriSwift Platform · Food Reserve Agency &amp; Ministry of Agriculture</div>
                    <div>Active Role: <strong>{user?.role || 'Stakeholder'}</strong></div>
                </div>
            </footer>
        </div>
    );
}

function NotFound() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <h1 style={{ fontSize: '36px', color: 'var(--agri-primary)' }}>404 — Page Not Found</h1>
            <Link to="/" className="agri-btn agri-btn-primary">Return to Home</Link>
        </div>
    );
}

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
                    <Route path="/farmer" element={<FarmerLayout />}>
                        <Route index element={<FarmerDashboard />} />
                        <Route path="records" element={<Records />} />
                        <Route path="receipt/:id" element={<ReceiptPage />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['officer', 'fra_officer', 'admin']} />}>
                    <Route path="/officer" element={<FRALayout />}>
                        <Route index element={<FRADashboard />} />
                        <Route path="intake" element={<CropIntake />} />
                        <Route path="register" element={<AssistRegistration />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['ministry', 'finance', 'auditor', 'admin']} />}>
                    <Route path="/ministry" element={<ExecutiveShell badgeText="Ministry Audit" badgeColor="#1e3a8a" />}>
                        <Route index element={<MinisterialDashboard />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}