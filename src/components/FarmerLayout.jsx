// src/components/FarmerLayout.jsx
import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './FarmerLayout.css';

function Icon({ name }) {
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9M9 21v-8h6v8" />
      </>
    ),
    records: (
      <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="5" width="18" height="15" rx="3" />
        <path d="M16 11h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
        <path d="M6 5V3h12" />
      </>
    ),
    logout: (
      <>
        <path d="M9 4H4v16h5M14 8l4 4-4 4M8 12h10" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    leaf: (
      <>
        <path d="M20 4C9 2 3 8 5 15s13 7 15-11Z" />
        <path d="M4 21 15 10" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function FarmerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const title = pathname.includes('/receipt/')
    ? 'Delivery receipt'
    : pathname.includes('/records')
      ? 'Delivery history'
      : 'Overview';

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
      setSigningOut(false);
    }
  };

  return (
    <div className="fp-shell">
      {open && (
        <button
          type="button"
          className="fp-backdrop"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="farmer-navigation"
        className={`fp-sidebar${open ? ' is-open' : ''}`}
      >
        <div className="fp-brand-row">
          <NavLink
            to="/farmer"
            className="fp-brand"
            onClick={() => setOpen(false)}
          >
            <span className="fp-brand-icon">
              <Icon name="leaf" />
            </span>
            <span>
              <strong>AgriSwift</strong>
              <small>Farmer portal</small>
            </span>
          </NavLink>

          <button
            type="button"
            className="fp-icon-button fp-mobile-close"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="fp-nav-caption">Your workspace</div>

        <nav className="fp-navigation" aria-label="Farmer navigation">
          <NavLink
            to="/farmer"
            end
            className={({ isActive }) => `fp-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <Icon name="home" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/farmer/records"
            className={({ isActive }) => `fp-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <Icon name="records" />
            <span>Deliveries &amp; receipts</span>
          </NavLink>

          <button
            type="button"
            className="fp-nav-link fp-nav-disabled"
            disabled
            title="Payout setup page is not yet available"
          >
            <Icon name="wallet" />
            <span>Payout setup</span>
            <small>Soon</small>
          </button>
        </nav>

        <div className="fp-simulation-note">
          <span className="fp-status-dot" />
          <div>
            <strong>Demonstration environment</strong>
            <p>Payments are simulated. No real funds are transferred.</p>
          </div>
        </div>

        <div className="fp-sidebar-footer">
          <div className="fp-user">
            <span className="fp-avatar">
              {(user?.name || 'F').slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{user?.name || 'Farmer'}</strong>
              <small>Farmer account</small>
            </div>
          </div>

          <button
            type="button"
            className="fp-logout"
            disabled={signingOut}
            onClick={handleLogout}
          >
            <Icon name="logout" />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      <div className="fp-workspace">
        <header className="fp-topbar">
          <div className="fp-topbar-title">
            <button
              type="button"
              className="fp-icon-button fp-menu-button"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls="farmer-navigation"
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <span>{title}</span>
          </div>

          <span className="fp-topbar-badge">Payment simulation</span>
        </header>

        <main className="fp-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}