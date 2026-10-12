// src/pages/FRA/AssistRegistration.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerFarmer } from '../../api/fra';
import { problemMessage } from '../../utils/format';
import '../../styles/ops.css';

const LANGS = ['ENGLISH', 'BEMBA', 'NYANJA', 'TONGA', 'LOZI'];

export default function AssistRegistration() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [f, setF] = useState({
    firstName: '', middleName: '', lastName: '', dateOfBirth: '',
    nationalId: params.get('nrc') ?? '', mobileNumber: '', email: '',
    preferredLanguage: 'ENGLISH', pin: '', pin2: '',
  });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const reg = useMutation({ mutationFn: registerFarmer });

  const submit = (e) => {
    e.preventDefault();
    const mobile = f.mobileNumber.replace(/[\s-]/g, '');
    if (!f.firstName.trim() || !f.lastName.trim()) return setErr('First and last name are required.');
    if (!f.dateOfBirth) return setErr('Date of birth is required.');
    if (!f.nationalId.trim()) return setErr('NRC is required.');
    if (!/^\+?[0-9]{10,15}$/.test(mobile)) return setErr('Enter a valid mobile money number, e.g. 0978602368.');
    if (f.pin && !/^\d{4,6}$/.test(f.pin)) return setErr('PIN must be 4 to 6 digits.');
    if (f.pin !== f.pin2) return setErr('The two PIN entries do not match.');
    setErr('');
    reg.mutate(
      {
        firstName: f.firstName.trim(), middleName: f.middleName.trim() || null, lastName: f.lastName.trim(),
        dateOfBirth: f.dateOfBirth, nationalId: f.nationalId.trim(), mobileNumber: mobile,
        email: f.email.trim() || null, preferredLanguage: f.preferredLanguage, pin: f.pin || null,
      },
      { onSuccess: (res) => setDone(res), onError: (e2) => setErr(problemMessage(e2)) },
    );
  };

  const goIntake = () => navigate(`/officer/intake?nrc=${encodeURIComponent(f.nationalId.trim())}`);

  if (done) {
    return (
      <div className="ops-page">
        <div className="ops-head"><h2>Farmer registered</h2></div>
        <div className="agri-card" style={{ maxWidth: 560, display: 'grid', gap: 14 }}>
          <div className="ops-alert ok">{f.firstName} {f.lastName} can now sell at this depot and sign in to the farmer portal.</div>
          {done.temporaryPin ? (
            <div className="ops-alert warn">
              Generated PIN: <b style={{ fontSize: 22, letterSpacing: 4 }}>{done.temporaryPin}</b>
              <br />Give it to the farmer now. It cannot be shown again.
            </div>
          ) : (
            <p className="ops-muted">The farmer's own PIN has been saved.</p>
          )}
          <button className="agri-btn agri-btn-primary" onClick={goIntake}>Continue to crop intake</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ops-page">
      <div className="ops-head">
        <h2>Assist Registration</h2>
        <p>Register a farmer who is struggling to sign up on their own.</p>
      </div>
      <form className="agri-card ops-form" onSubmit={submit} style={{ maxWidth: 720 }}>
        <div className="ops-field"><label>First name</label><input value={f.firstName} onChange={set('firstName')} /></div>
        <div className="ops-field"><label>Middle name (optional)</label><input value={f.middleName} onChange={set('middleName')} /></div>
        <div className="ops-field"><label>Last name</label><input value={f.lastName} onChange={set('lastName')} /></div>
        <div className="ops-field"><label>Date of birth</label><input type="date" value={f.dateOfBirth} onChange={set('dateOfBirth')} /></div>
        <div className="ops-field"><label>NRC</label><input placeholder="293841/61/1" value={f.nationalId} onChange={set('nationalId')} /></div>
        <div className="ops-field"><label>Mobile money number</label><input placeholder="0978602368" value={f.mobileNumber} onChange={set('mobileNumber')} /></div>
        <div className="ops-field"><label>Email (optional)</label><input type="email" value={f.email} onChange={set('email')} /></div>
        <div className="ops-field">
          <label>Preferred language</label>
          <select value={f.preferredLanguage} onChange={set('preferredLanguage')}>
            {LANGS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="ops-field">
          <label>Farmer's PIN (4–6 digits)</label>
          <input type="password" inputMode="numeric" maxLength={6} value={f.pin} onChange={set('pin')} />
          <small>Let the farmer type it. Leave blank to generate one.</small>
        </div>
        <div className="ops-field">
          <label>Confirm PIN</label>
          <input type="password" inputMode="numeric" maxLength={6} value={f.pin2} onChange={set('pin2')} />
        </div>
        {err && <div className="ops-alert bad span2">{err}</div>}
        <div className="span2">
          <button className="agri-btn agri-btn-primary agri-btn-lg" style={{ width: '100%' }} disabled={reg.isPending}>
            {reg.isPending ? 'Registering…' : 'Register farmer'}
          </button>
        </div>
      </form>
    </div>
  );
}