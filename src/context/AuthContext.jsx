import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tokens } from '../api/client.js';
import { farmerLogin, staffLogin, farmerLogout, staffLogout } from '../api/authApi.js';

const KEY = 'agri.session';
const read  = () => { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; } };
const write = (s) => sessionStorage.setItem(KEY, JSON.stringify(s));

const ROLE_MAP = {
  FARMER: 'farmer', ADMIN: 'admin', DEPOT_OFFICER: 'officer',
  FRA_OFFICER: 'fra_officer', MINISTRY: 'ministry', FINANCE: 'finance',
};

/** Backend UserPrincipal → app user with a single lowercase `role`. */
export function toAppUser(u) {
  const roles = (u?.roles ?? [])
    .map((r) => ROLE_MAP[String(r).toUpperCase().replace(/^ROLE_/, '')] ?? String(r).toLowerCase());
  const role = u?.principalType === 'FARMER' ? 'farmer' : (roles[0] ?? 'officer');
  return { ...u, roles, role, name: u?.username ?? '' };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const s = read();
    if (s) Object.assign(tokens, { access: s.access, refresh: s.refresh, type: s.type });
    return s;
  });

  const clear = useCallback(() => {
    Object.assign(tokens, { access: null, refresh: null });
    sessionStorage.removeItem(KEY);
    setSession(null);
  }, []);

  useEffect(() => {
    tokens.onAuthLost = clear;
    tokens.onRotate = () => {
      const s = read();
      if (s) write({ ...s, access: tokens.access, refresh: tokens.refresh });
    };
    return () => { tokens.onAuthLost = () => {}; tokens.onRotate = () => {}; };
  }, [clear]);

  const login = useCallback(async (payload, type = 'farmer') => {
    const { data } = await (type === 'farmer' ? farmerLogin : staffLogin)(payload);
    const s = { access: data.accessToken, refresh: data.refreshToken, type, user: toAppUser(data.user) };
    Object.assign(tokens, { access: s.access, refresh: s.refresh, type });
    write(s);
    setSession(s);
    return s.user;
  }, []);

  const logout = useCallback(async () => {
    try { await (tokens.type === 'farmer' ? farmerLogout : staffLogout)(); } catch { /* clear anyway */ }
    clear();
  }, [clear]);

  const value = useMemo(() => ({ user: session?.user ?? null, login, logout }), [session, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}