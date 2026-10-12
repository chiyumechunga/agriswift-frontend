// src/pages/FRA/FRALayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const items = [
  { to: '/officer',          label: 'Depot analytics',     icon: 'monitoring', end: true },
  { to: '/officer/intake',   label: 'Crop intake',         icon: 'scale' },
  { to: '/officer/register', label: 'Assist registration', icon: 'person_add' },
];

export default function FRALayout() {
  const { user, logout } = useAuth();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside className="ops-side">
        <h3>AgriSwift · FRA</h3>
        <small>{user?.name} · Depot {user?.depotId ?? '—'}</small>
        <nav>
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className="ops-nav">
              <span className="material-symbols-outlined">{i.icon}</span>{i.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout}>Sign out</button>
      </aside>
      <main style={{ padding: 24 }}><Outlet /></main>
    </div>
  );
}