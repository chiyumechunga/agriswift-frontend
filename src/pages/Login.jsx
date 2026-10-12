// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './auth.css';

// Where each role lands after login (matches the routes in App.jsx)
const homeFor = (role) =>
    role === 'farmer' ? '/farmer'
    : role === 'ministry' || role === 'finance' ? '/ministry'
    : '/officer';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState('');
    const [role, setRole] = useState('farmer');
    const [authMode, setAuthMode] = useState('secret'); // 'secret' = PIN/password | 'otp' = optional
    const [secret, setSecret] = useState('');
    const [showSecret, setShowSecret] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [token, setToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [depot, setDepot] = useState('Monze Central Silos (Southern)');

    // Dynamic role detection
    useEffect(() => {
        if (identifier.toUpperCase().startsWith('FRA-') || identifier.includes('@')) setRole('officer');
        else if (identifier.length > 0) setRole('farmer');
    }, [identifier]);

    const handleNext = async () => {
        if (step === 1) { setStep(2); return; }
        if (authMode === 'otp') { setError('SMS OTP is not enabled on this deployment yet.'); return; }

        setBusy(true);
        setError('');
        try {
            const payload = role === 'farmer'
                ? { identifier: identifier.trim(), pin: secret }        // LoginRequest: identifier + pin
                : { username: identifier.trim(), password: token };     // LoginRequest: username + password
            const user = await login(payload, role === 'farmer' ? 'farmer' : 'staff');
            navigate(location.state?.from?.pathname ?? homeFor(user.role), { replace: true });
        } catch (e) {
            setError(e.response?.status === 401
                ? 'Incorrect identifier or passcode.'
                : 'Cannot reach AgriSwift right now.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="auth-shell">
            <main className="auth-stage">
                <section className="auth-card">
                    {step === 2 && (
                        <button className="auth-back" onClick={() => setStep(1)} aria-label="Back">
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
                                    ? (role === 'farmer'
                                        ? 'Use your farmer NRC or mobile money number.'
                                        : 'Use your FRA depot badge credentials.')
                                    : (role === 'farmer'
                                        ? `Enter the passcode linked to ${identifier || 'your account'}.`
                                        : 'Authorize this depot terminal to continue.')}
                            </p>
                            <span className={`auth-rolechip ${role === 'officer' ? 'auth-rolechip--officer' : ''}`}>
                                <span className="auth-livedot"></span>
                                {role === 'farmer' ? 'Farmer access' : 'Depot officer'} ·
                            </span>
                        </div>

                        {/* Right: form */}
                        <div className="auth-form">
                            {step === 1 && (
                                <>
                                    <div className="auth-field">
                                        <input id="identifier" type="text" placeholder=" "
                                               value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                                               onKeyDown={(e) => { if (e.key === 'Enter' && identifier.trim() !== '') handleNext(); }} />
                                        <label htmlFor="identifier">NRC, phone, or badge ID</label>
                                    </div>
                                    <p className="auth-note">
                                        Sharing a depot tablet? Sign in inside a private window so your passcode stays yours.{' '}
                                        <span>Learn more about shared-device safety</span>
                                    </p>
                                </>
                            )}

                            {/* Farmer: ONE secret field, OTP optional */}
                            {step === 2 && role === 'farmer' && authMode === 'secret' && (
                                <>
                                    <div className="auth-field">
                                        <div className="auth-cap">
                                            <input
                                                id="secret"
                                                className={`auth-secret ${showSecret ? 'is-shown' : ''}`}
                                                type={showSecret ? 'text' : 'password'}
                                                placeholder=" "
                                                value={secret}
                                                onChange={(e) => setSecret(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter' && !busy) handleNext(); }}
                                            />
                                            <label htmlFor="secret">PIN or password</label>
                                            <button type="button" className="auth-eye" onClick={() => setShowSecret(v => !v)} aria-label="Toggle visibility">
                                                <span className="material-symbols-outlined">{showSecret ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="button" className="auth-helplink" onClick={() => setAuthMode('otp')}>
                                        Use SMS OTP instead (optional)
                                    </button>
                                    <button type="button" className="auth-helplink">Forgot passcode?</button>
                                </>
                            )}

                            {/* Optional OTP mode */}
                            {step === 2 && role === 'farmer' && authMode === 'otp' && (
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
                                        Use PIN / password instead
                                    </button>
                                </>
                            )}

                            {/* Officer: depot + single token field */}
                            {step === 2 && role === 'officer' && (
                                <>
                                    <div className="auth-field auth-field--float">
                                        <select id="depot" value={depot} onChange={(e) => setDepot(e.target.value)}>
                                            <option>Monze Central Silos (Southern)</option>
                                            <option>Chipata Main Holding Depot (Eastern)</option>
                                            <option>Kasama District Storage (Northern)</option>
                                            <option>Mpongwe Agro Logistics Hub (Copperbelt)</option>
                                            <option>Lusaka National Strategic Reserve</option>
                                        </select>
                                        <label htmlFor="depot">Assigned depot</label>
                                    </div>
                                    <div className="auth-field">
                                        <div className="auth-cap">
                                            <input
                                                id="token"
                                                className={`auth-secret ${showToken ? 'is-shown' : ''}`}
                                                type={showToken ? 'text' : 'password'}
                                                placeholder=" "
                                                value={token}
                                                onChange={(e) => setToken(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter' && !busy) handleNext(); }}
                                            />
                                            <label htmlFor="token">Master security token</label>
                                            <button type="button" className="auth-eye" onClick={() => setShowToken(v => !v)} aria-label="Toggle visibility">
                                                <span className="material-symbols-outlined">{showToken ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {error && (
                                <p role="alert" style={{ color: '#ba1a1a', fontSize: 14, margin: 0 }}>{error}</p>
                            )}

                            <div className="auth-actions">
                                {step === 2 && role === 'farmer' && (
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