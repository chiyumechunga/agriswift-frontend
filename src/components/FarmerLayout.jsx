import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SyncStatus } from './SyncStatus';
import './FarmerLayout.css';

export default function FarmerLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="layout-root">
            <header className="mobile-header">
                <button className="icon-btn"><span className="material-symbols-outlined">agriculture</span></button>
                <h1 className="brand">AgriSwift</h1>
                <button className="icon-btn" onClick={logout}><span className="material-symbols-outlined">logout</span></button>
            </header>

            <aside className="desktop-sidebar">
                <div className="sidebar-header">
                    <h1 className="brand">AgriSwift</h1>
                    <div className="profile-badge">
                        <div className="avatar">{user?.name?.charAt(0) || 'F'}</div>
                        <div>
                            <p className="profile-name">{user?.name}</p>
                            <p className="profile-id">ID: {user?.id}</p>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/farmer" end className="nav-item"><span className="material-symbols-outlined">dashboard</span> Dashboard</NavLink>
                    <NavLink to="/farmer/records" className="nav-item"><span className="material-symbols-outlined">badge</span> Records</NavLink>
                    <NavLink to="/farmer/intake" className="nav-item"><span className="material-symbols-outlined">input</span> Intake</NavLink>
                    <button className="nav-item logout" onClick={logout}><span className="material-symbols-outlined">logout</span> Logout</button>
                </nav>
            </aside>

            <main className="main-canvas">
                <SyncStatus />
                <div className="content-pad">
                    <Outlet />
                </div>
            </main>

            <nav className="mobile-bottom-nav">
                <NavLink to="/farmer/intake" className="bottom-item">
                    <span className="material-symbols-outlined">input</span>
                    <span>Intake</span>
                </NavLink>
                <NavLink to="/farmer" end className="bottom-item">
                    <span className="material-symbols-outlined">home</span>
                    <span>Home</span>
                </NavLink>
                <NavLink to="/farmer/records" className="bottom-item">
                    <span className="material-symbols-outlined">badge</span>
                    <span>Records</span>
                </NavLink>
            </nav>
        </div>
    );
}