// src/pages/Signup.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const STEPS = {
    1: { title: 'Create your Farmer Account', sub: 'Enter your identity details.' },
    2: { title: 'Where is your farm?', sub: 'For regional reporting only — you may deliver to any FRA depot.' },
    3: { title: 'Choose a 4-digit PIN', sub: 'You will use it to approve harvest payouts.' },
    4: { title: 'Confirm your details', sub: 'Review before we register you on the ledger.' },
};

export default function Signup() {
    const [step, setStep] = useState(1);
    const [showPin, setShowPin] = useState(false);
    const [formData, setFormData] = useState({ nrc: '', phone: '', province: '', district: '', pin: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const canContinue =
        step === 1 ? formData.nrc.trim() !== '' && formData.phone.trim() !== '' :
            step === 3 ? formData.pin.length === 4 :
                true;

    const next = () => setStep((s) => Math.min(s + 1, 4));
    const back = () => setStep((s) => Math.max(s - 1, 1));
    const submit = () => console.log('POST /api/v1/auth/farmer/register', formData);

    return (
        <div className="auth-shell">
            <main className="auth-stage">
                <section className="auth-card">
                    {step > 1 && (
                        <button className="auth-back" onClick={back} aria-label="Back">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    )}

                    <div className="auth-grid">
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
                            <p className="auth-stepflag">Step {step} of 4</p>
                            <h1 className="auth-headline">{STEPS[step].title}</h1>
                            <p className="auth-sub">{STEPS[step].sub}</p>
                        </div>

                        <div className="auth-form">
                            {step === 1 && (
                                <>
                                    <div className="auth-field">
                                        <input id="nrc" name="nrc" type="text" placeholder=" " value={formData.nrc} onChange={handleChange} />
                                        <label htmlFor="nrc">NRC number</label>
                                    </div>
                                    <div className="auth-field">
                                        <input id="phone" name="phone" type="tel" placeholder=" " value={formData.phone} onChange={handleChange} />
                                        <label htmlFor="phone">Mobile money phone</label>
                                    </div>
                                    <p className="auth-note">Must be an Airtel, MTN, or Zamtel number registered to your NRC.</p>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="auth-field">
                                        <input id="province" name="province" type="text" placeholder=" " value={formData.province} onChange={handleChange} />
                                        <label htmlFor="province">Province</label>
                                    </div>
                                    <div className="auth-field">
                                        <input id="district" name="district" type="text" placeholder=" " value={formData.district} onChange={handleChange} />
                                        <label htmlFor="district">District</label>
                                    </div>
                                </>
                            )}

                            {/* ONE single PIN field */}
                            {step === 3 && (
                                <>
                                    <div className="auth-field">
                                        <div className="auth-cap">
                                            <input
                                                id="pin" name="pin"
                                                className={`auth-secret ${showPin ? 'is-shown' : ''}`}
                                                type={showPin ? 'text' : 'password'}
                                                inputMode="numeric" maxLength={4}
                                                placeholder=" "
                                                value={formData.pin}
                                                onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                                            />
                                            <label htmlFor="pin">4-digit PIN</label>
                                            <button type="button" className="auth-eye" onClick={() => setShowPin(v => !v)} aria-label="Toggle visibility">
                                                <span className="material-symbols-outlined">{showPin ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="auth-note">SMS OTP is optional — this PIN alone authorizes your payouts at any depot.</p>
                                </>
                            )}

                            {step === 4 && (
                                <div className="auth-review">
                                    <div className="auth-review-row"><strong>NRC</strong><span>{formData.nrc || '—'}</span></div>
                                    <div className="auth-review-row"><strong>Phone</strong><span>{formData.phone || '—'}</span></div>
                                    <div className="auth-review-row"><strong>Farm location</strong><span>{[formData.district, formData.province].filter(Boolean).join(', ') || '—'}</span></div>
                                    <div className="auth-review-row"><strong>PIN</strong><span>••••</span></div>
                                </div>
                            )}

                            <div className="auth-actions">
                                {step === 1 && <Link to="/login" className="auth-textbtn auth-push">Sign in instead</Link>}
                                <button className="auth-next" onClick={step < 4 ? next : submit} disabled={!canContinue}>
                                    {step < 4 ? 'Next' : 'Create account'}
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