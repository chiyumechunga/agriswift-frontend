// src/components/FarmerLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function FarmerLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout('farmer');
        navigate('/login', { replace: true });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f9f9', fontFamily: 'Inter, sans-serif' }}>
            <header style={{ height: 64, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
                <strong style={{ color: '#00450d' }}>AgriSwift — Farmer Portal</strong>
                <nav style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 14, fontWeight: 600 }}>
                    <NavLink to="/farmer" end style={{ color: '#00450d' }}>Dashboard</NavLink>
                    <NavLink to="/farmer/records" style={{ color: '#41493e' }}>Records</NavLink>
                    <NavLink to="/farmer/intake" style={{ color: '#41493e' }}>Intake</NavLink>
                    <button onClick={handleLogout} style={{ height: 40, padding: '0 16px', borderRadius: 4, border: '1.5px solid #717a6d', background: '#fff', color: '#00450d', fontWeight: 600, cursor: 'pointer' }}>
                        Log Out
                    </button>
                </nav>
            </header>
            <main style={{ flex: 1, padding: 24 }}>
                <Outlet /> {/* ← child routes render here */}
            </main>
        </div>
    );
}