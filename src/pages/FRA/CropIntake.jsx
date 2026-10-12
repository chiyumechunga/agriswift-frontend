// src/pages/FRA/CropIntake.jsx — weighbridge crop buying: find the farmer, record the delivery, trigger payment
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useCrops, useDepotReport } from '../../hooks/useOps';
import { lookupFarmer, recordDelivery } from '../../api/fra';
import { deviceId, int, kgFmt, mt, problemMessage, todayISO, zmw } from '../../utils/format';
import '../../styles/ops.css';

const BAG_KG = 50;          // standard FRA bag
const MAX_KG = 1_000_000;   // mirrors the server-side cap (20,000 bags)

export default function CropIntake() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const { data: crops = [], isLoading: cropsLoading, error: cropsError } = useCrops();
  const { data: report } = useDepotReport();

  const [query, setQuery] = useState(params.get('nrc') ?? '');
  const [lookup, setLookup] = useState({ status: 'idle', farmer: null, msg: '' });
  const [form, setForm] = useState({ cropPriceId: '', bags: '', weight: '', moisture: '', date: todayISO() });
  const [weightTouched, setWeightTouched] = useState(false);
  const [formError, setFormError] = useState('');
  const [result, setResult] = useState(null);

  const deliver = useMutation({
    mutationFn: (payload) => recordDelivery(payload, deviceId()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['depotReport'] }),
  });

  // ---- farmer lookup ----------------------------------------------------------------------------
  const doLookup = useCallback(async (raw) => {
    const q = raw.trim();
    if (!q) return;
    setResult(null);
    setFormError('');
    setLookup({ status: 'loading', farmer: null, msg: '' });
    try {
      // An NRC always contains '/', a mobile number never does.
      const farmer = await lookupFarmer(q.includes('/') ? { nrc: q } : { mobile: q.replace(/[\s-]/g, '') });
      setLookup({ status: 'found', farmer, msg: '' });
    } catch (e) {
      if (e.response?.status === 404) setLookup({ status: 'missing', farmer: null, msg: '' });
      else setLookup({ status: 'error', farmer: null, msg: problemMessage(e) });
    }
  }, []);

  // Arriving from "Assist Registration" with ?nrc=… looks the farmer up straight away.
  const autoLooked = useRef(false);
  useEffect(() => {
    const nrc = params.get('nrc');
    if (nrc && !autoLooked.current) {
      autoLooked.current = true;
      doLookup(nrc);
    }
  }, [params, doLookup]);

  // ---- derived values ---------------------------------------------------------------------------
  const defaultCrop = crops.find((c) => /maize/i.test(c.name)) ?? crops[0];
  const cropPriceId = form.cropPriceId || String(defaultCrop?.cropPriceId ?? '');
  const crop = crops.find((c) => String(c.cropPriceId) === cropPriceId);

  const bagsN = form.bags === '' ? 0 : Number(form.bags);
  const weightN = form.weight === '' ? 0 : Number(form.weight);
  const moistureN = form.moisture === '' ? null : Number(form.moisture);
  const maxMoisture = crop?.maxMoisturePct != null ? Number(crop.maxMoisturePct) : null;
  const tooWet = maxMoisture != null && moistureN != null && moistureN > maxMoisture;
  const estimate = crop && weightN > 0 && !tooWet ? weightN * Number(crop.pricePerKg) : 0;
  const farmer = lookup.farmer;
  const canRecord = lookup.status === 'found' && farmer?.active;

  const onBags = (e) => {
    const bags = e.target.value.replace(/\D/g, '');
    setForm((f) => ({ ...f, bags, weight: weightTouched ? f.weight : bags ? String(Number(bags) * BAG_KG) : '' }));
  };
  const onWeight = (e) => {
    setWeightTouched(e.target.value !== '');
    setForm((f) => ({ ...f, weight: e.target.value }));
  };
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    if (!user?.depotId) return 'Your account has no depot assigned, so deliveries cannot be recorded.';
    if (!crop) return 'Choose a commodity.';
    if (!(bagsN > 0)) return 'Enter the number of bags.';
    if (!(weightN > 0)) return 'Enter the net weight.';
    if (weightN > MAX_KG) return `A single delivery cannot exceed ${int(MAX_KG)} kg.`;
    if (moistureN == null || Number.isNaN(moistureN) || moistureN < 0 || moistureN > 100) {
      return 'Enter the measured moisture (0–100%).';
    }
    if (form.date > todayISO()) return 'Delivery date cannot be in the future.';
    return '';
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    setFormError(err);
    if (err) return;
    deliver.mutate(
      {
        farmerId: farmer.farmerId,
        cropTypeId: crop.cropTypeId,
        cropPriceId: crop.cropPriceId,
        cropWeightKg: Number(weightN.toFixed(2)),
        moistureContentPct: moistureN,
        deliveryDate: form.date,
      },
      {
        onSuccess: (res) =>
          setResult({ ...res, farmerName: farmer.fullName, cropName: crop.name, bags: bagsN, weightKg: weightN, estimate, tooWet, maxMoisture }),
        onError: (er) => setFormError(problemMessage(er)),
      },
    );
  };

  const resetDelivery = () => {
    setResult(null);
    setFormError('');
    setForm({ cropPriceId: '', bags: '', weight: '', moisture: '', date: todayISO() });
    setWeightTouched(false);
  };
  const newFarmer = () => {
    resetDelivery();
    setQuery('');
    setLookup({ status: 'idle', farmer: null, msg: '' });
  };

  // ---- render -----------------------------------------------------------------------------------
  return (
    <div className="ops-page">
      <div className="ops-head">
        <h2>Crop Intake</h2>
        <p>Find the farmer, record what the weighbridge shows, and payment is triggered automatically.</p>
      </div>

      <div className="ops-split">
        <div className="ops-stack">
          {/* 1 — farmer */}
          <div className="agri-card">
            <h3 className="agri-card-title">1 · Find the farmer</h3>
            <div className="ops-field" style={{ marginTop: 12 }}>
              <label htmlFor="farmer-q">Farmer NRC or mobile money number</label>
              <div className="ops-inline">
                <input
                  id="farmer-q"
                  value={query}
                  placeholder="e.g. 293841/61/1 or 0978602368"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doLookup(query); } }}
                />
                <button type="button" className="agri-btn agri-btn-primary" disabled={!query.trim() || lookup.status === 'loading'} onClick={() => doLookup(query)}>
                  {lookup.status === 'loading' ? 'Searching…' : 'Find farmer'}
                </button>
              </div>
              <small>Type it exactly as it was registered (NRC with slashes).</small>
            </div>

            {lookup.status === 'missing' && (
              <div className="ops-alert warn" style={{ marginTop: 14 }}>
                No farmer is registered with that number.{' '}
                <Link to={`/officer/register${query.includes('/') ? `?nrc=${encodeURIComponent(query.trim())}` : ''}`}>
                  Register them now
                </Link>
              </div>
            )}
            {lookup.status === 'error' && <div className="ops-alert bad" style={{ marginTop: 14 }}>{lookup.msg}</div>}

            {farmer && (
              <div className="ops-farmer">
                <div>
                  <strong>{farmer.fullName}</strong>
                  <small>{farmer.farmerCode} · {farmer.maskedMobile}</small>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`ops-badge ${farmer.kycVerified ? 'ok' : 'warn'}`}>{farmer.kycVerified ? 'KYC verified' : 'KYC pending'}</span>
                  {!farmer.active && <span className="ops-badge bad">Deactivated</span>}
                </div>
              </div>
            )}
            {farmer && !farmer.active && (
              <div className="ops-alert bad" style={{ marginTop: 14 }}>This farmer account is deactivated; deliveries cannot be recorded.</div>
            )}
          </div>

          {/* 2 — delivery */}
          <div className="agri-card" style={canRecord ? undefined : { opacity: 0.55 }}>
            <h3 className="agri-card-title">2 · Record the delivery</h3>
            {cropsError && <div className="ops-alert bad" style={{ marginTop: 12 }}>Could not load crop prices: {problemMessage(cropsError)}</div>}
            {!cropsLoading && !cropsError && crops.length === 0 && (
              <div className="ops-alert warn" style={{ marginTop: 12 }}>No crop price is currently in force. Ask an administrator to publish this season's prices.</div>
            )}

            {result ? (
              <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
                {result.validationStatus === 'VALIDATED' ? (
                  <div className="ops-alert ok">
                    Delivery recorded for {result.farmerName}: {int(result.bags)} bags · {kgFmt(result.weightKg)} of {result.cropName}.
                    {' '}Receipt <b>{result.receiptSerialNumber}</b>. Payment of <b>{zmw(result.estimate)}</b> has been queued for settlement.
                  </div>
                ) : (
                  <div className="ops-alert warn">
                    The delivery was recorded but <b>rejected</b>, so no payment will be made.{' '}
                    {result.tooWet ? `Moisture is above the ${result.maxMoisture}% limit for ${result.cropName}.` : 'The farmer could not be confirmed in the registry.'}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="agri-btn agri-btn-primary" onClick={resetDelivery}>Record another for {result.farmerName.split(' ')[0]}</button>
                  <button className="agri-btn agri-btn-outline" onClick={newFarmer}>Next farmer</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="ops-form">
                <fieldset disabled={!canRecord || deliver.isPending} style={{ display: 'contents', border: 0 }}>
                  <div className="ops-field span2">
                    <label htmlFor="crop">Commodity (current board price)</label>
                    <select id="crop" value={cropPriceId} onChange={set('cropPriceId')}>
                      {crops.map((c) => (
                        <option key={c.cropPriceId} value={c.cropPriceId}>
                          {c.name} — {zmw(c.pricePerKg)}/kg · max moisture {c.maxMoisturePct ?? '—'}%
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ops-field">
                    <label htmlFor="bags">Number of {BAG_KG} kg bags</label>
                    <input id="bags" inputMode="numeric" placeholder="e.g. 5200" value={form.bags} onChange={onBags} />
                    {bagsN > 5000 && <small>Bulk intake · {int(bagsN)} bags · {mt(bagsN * BAG_KG)}</small>}
                  </div>
                  <div className="ops-field">
                    <label htmlFor="weight">Net weight (kg)</label>
                    <input id="weight" type="number" min="0" step="0.01" placeholder={`bags × ${BAG_KG}`} value={form.weight} onChange={onWeight} />
                    <small>Filled from bags; overwrite with the weighbridge reading if it differs.</small>
                  </div>
                  <div className="ops-field">
                    <label htmlFor="moisture">Measured moisture (%)</label>
                    <input id="moisture" type="number" min="0" max="100" step="0.1" placeholder={maxMoisture != null ? `limit ${maxMoisture}%` : 'e.g. 12.5'} value={form.moisture} onChange={set('moisture')} />
                    {tooWet && <small style={{ color: '#b91c1c', fontWeight: 700 }}>Above the {maxMoisture}% limit: this delivery will be rejected and unpaid.</small>}
                  </div>
                  <div className="ops-field">
                    <label htmlFor="date">Delivery date</label>
                    <input id="date" type="date" max={todayISO()} value={form.date} onChange={set('date')} />
                  </div>

                  {formError && <div className="ops-alert bad span2">{formError}</div>}

                  <div className="span2">
                    <button type="submit" className="agri-btn agri-btn-primary agri-btn-lg" style={{ width: '100%' }} disabled={!canRecord || deliver.isPending || !crop}>
                      {deliver.isPending ? 'Recording…' : 'Approve intake & trigger payment'}
                    </button>
                  </div>
                </fieldset>
              </form>
            )}
          </div>
        </div>

        {/* side summary */}
        <div className="ops-stack">
          <div className="agri-card">
            <h3 className="agri-card-title">This delivery</h3>
            <div className="ops-sum">
              <div><span>Bags</span><b>{int(bagsN)}</b></div>
              <div><span>Net weight</span><b>{kgFmt(weightN)} ({mt(weightN)})</b></div>
              <div><span>Price</span><b>{crop ? `${zmw(crop.pricePerKg)}/kg` : '—'}</b></div>
              <div><span>Estimated payment</span><span className="big">{zmw(estimate)}</span></div>
            </div>
            <p className="ops-muted" style={{ marginTop: 12 }}>Final amount is calculated by the server from the price on record.</p>
          </div>
          <div className="agri-card">
            <h3 className="agri-card-title">Today at this depot</h3>
            <div className="ops-sum">
              <div><span>Deliveries</span><b>{int(report?.today.deliveries)}</b></div>
              <div><span>Intake</span><b>{mt(report?.today.weightKg)}</b></div>
              <div><span>Value</span><b>{zmw(report?.today.amount)}</b></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}