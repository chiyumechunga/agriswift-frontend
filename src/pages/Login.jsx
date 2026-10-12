// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './auth.css';

// Where each role lands after login (must match the routes and allowedRoles in App.jsx)
const homeFor = (role) => {
    switch (role) {
        case 'farmer':           return '/farmer';
        case 'ministry_officer': return '/ministry';
        case 'auditor':          return '/ministry';
        case 'fra_officer':      return '/officer';
        case 'admin':            return '/officer';
        default:                 return '/';
    }
};

// Farmer identifiers are an NRC (999999/61/1) or a mobile number (0978602368, +260978602368):
// digits, slashes, spaces, dashes and an optional leading +. Anything with letters is a staff username.
const looksLikeFarmer = (id) => /^[\d/+\s-]+$/.test(id.trim());

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState('');
    const [authMode, setAuthMode] = useState('secret'); // 'secret' = PIN/password | 'otp' = optional
    const [secret, setSecret] = useState('');
    const [showSecret, setShowSecret] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    // Derived from what was typed, so it can never get out of sync with the input.
    const isFarmer = identifier.trim() === '' || looksLikeFarmer(identifier);
    const accountType = isFarmer ? 'farmer' : 'staff';

    const handleNext = async () => {
        if (step === 1) { setStep(2); return; }
        if (authMode === 'otp') { setError('SMS OTP is not enabled on this deployment yet.'); return; }
        if (secret === '') { setError(isFarmer ? 'Enter your PIN.' : 'Enter your password.'); return; }

        setBusy(true);
        setError('');
        try {
            const payload = isFarmer
                ? { identifier: identifier.trim(), pin: secret }        // POST /api/v1/auth/farmer/login
                : { username: identifier.trim(), password: secret };    // POST /api/v1/auth/login
            const user = await login(payload, accountType);

            // Only honour the page the user was sent from if their role is allowed there.
            const home = homeFor(user.role);
            const from = location.state?.from?.pathname;
            const target = from && from.startsWith(home) ? from : home;
            navigate(target, { replace: true });
        } catch (e) {
            console.error('Login failed:', e.response?.status, e.response?.data ?? e);
            const status = e.response?.status;
            setError(
                status === 401 ? 'Incorrect identifier or passcode.'
                : status === 403 ? 'This account is locked or not allowed to sign in.'
                : status === 400 ? 'The sign-in request was rejected. Check the details and try again.'
                : e.response ? `Sign-in failed (error ${status}).`
                : 'Cannot reach AgriSwift right now.'
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="auth-shell">
            <main className="auth-stage">
                <section className="auth-card">
                    {step === 2 && (
                        <button className="auth-back" onClick={() => { setStep(1); setError(''); }} aria-label="Back">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    )}

                    <div className="auth-grid">
                        {/* Left: intro */}
                        <div>
                            <div className="auth-brandrow">
                                <div className="auth-logo"><span className="material-symbols-outlined">agriculture</span></div>
                                <div className="auth-wordmark">
                                    AgriSwift
                                    <span className="auth-fra-pill">
                                        <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>verified_user</span>FRA
                                    </span>
                                </div>
                            </div>
                            <h1 className="auth-headline">{step === 1 ? 'Sign in' : "Verify it's you"}</h1>
                            <p className="auth-sub">
                                {step === 1
                                    ? (isFarmer
                                        ? 'Use your farmer NRC or mobile money number.'
                                        : 'Use your AgriSwift staff username.')
                                    : (isFarmer
                                        ? `Enter the PIN linked to ${identifier || 'your account'}.`
                                        : `Enter the password for ${identifier}.`)}
                            </p>
                            <span className={`auth-rolechip ${!isFarmer ? 'auth-rolechip--officer' : ''}`}>
                                <span className="auth-livedot"></span>
                                {isFarmer ? 'Farmer access' : 'Staff access'}
                            </span>
                        </div>

                        {/* Right: form */}
                        <div className="auth-form">
                            {step === 1 && (
                                <>
                                    <div className="auth-field">
                                        <input id="identifier" type="text" placeholder=" "
                                               autoComplete="username"
                                               value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                                               onKeyDown={(e) => { if (e.key === 'Enter' && identifier.trim() !== '') handleNext(); }} />
                                        <label htmlFor="identifier">NRC, phone, or staff username</label>
                                    </div>
                                    <p className="auth-note">
                                        Sharing a depot tablet? Sign in inside a private window so your passcode stays yours.{' '}
                                        <span>Learn more about shared-device safety</span>
                                    </p>
                                </>
                            )}

                            {/* Farmer + staff share ONE secret field (PIN for farmers, password for staff) */}
                            {step === 2 && authMode === 'secret' && (
                                <>
                                    <div className="auth-field">
                                        <div className="auth-cap">
                                            <input
                                                id="secret"
                                                className={`auth-secret ${showSecret ? 'is-shown' : ''}`}
                                                type={showSecret ? 'text' : 'password'}
                                                placeholder=" "
                                                autoComplete="current-password"
                                                value={secret}
                                                onChange={(e) => setSecret(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter' && !busy) handleNext(); }}
                                            />
                                            <label htmlFor="secret">{isFarmer ? 'PIN' : 'Password'}</label>
                                            <button type="button" className="auth-eye" onClick={() => setShowSecret(v => !v)} aria-label="Toggle visibility">
                                                <span className="material-symbols-outlined">{showSecret ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    {isFarmer && (
                                        <button type="button" className="auth-helplink" onClick={() => setAuthMode('otp')}>
                                            Use SMS OTP instead (optional)
                                        </button>
                                    )}
                                    <button type="button" className="auth-helplink">Forgot passcode?</button>
                                </>
                            )}

                            {/* Optional OTP mode (farmers only) */}
                            {step === 2 && isFarmer && authMode === 'otp' && (
                                <>
                                    <button type="button" className="auth-textbtn" style={{ alignSelf: 'flex-start' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sms</span>
                                        Send free OTP SMS
                                    </button>
                                    <div className="auth-field">
                                        <div className="auth-cap auth-cap--code">
                                            <input id="otp" className="auth-code" type="text" inputMode="numeric" maxLength={6}
                                                   placeholder=" " value={otpCode}
                                                   onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} />
                                            <label htmlFor="otp">6-digit SMS code</label>
                                        </div>
                                    </div>
                                    <button type="button" className="auth-helplink" onClick={() => setAuthMode('secret')}>
                                        Use PIN instead
                                    </button>
                                </>
                            )}

                            {error && (
                                <p role="alert" style={{ color: '#ba1a1a', fontSize: 14, margin: 0 }}>{error}</p>
                            )}

                            <div className="auth-actions">
                                {step === 2 && isFarmer && (
                                    <button type="button" className="auth-textbtn auth-push">
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>fingerprint</span>
                                        Use biometric
                                    </button>
                                )}
                                {step === 1 && <Link to="/signup" className="auth-textbtn">Create account</Link>}
                                <button
                                    className="auth-next"
                                    disabled={busy || (step === 1 && identifier.trim() === '')}
                                    onClick={handleNext}
                                >
                                    {busy ? 'Signing in…' : step === 1 ? 'Next' : 'Sign in'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="auth-footer">
                <nav className="auth-footer-links">
                    <a href="#help">Help</a>
                    <a href="#privacy">Privacy</a>
                    <a href="#terms">Terms</a>
                </nav>
            </footer>
        </div>
    );
}