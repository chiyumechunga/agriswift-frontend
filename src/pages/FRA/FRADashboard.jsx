// src/pages/FRA/FRADashboard.jsx
import { Link } from 'react-router-dom';
import { useDepotReport } from '../../hooks/useOps';
import { int, kgFmt, mt, problemMessage, zmw } from '../../utils/format';
import '../../styles/ops.css';

const dayLabel = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short' });

export default function FRADashboard() {
  const { data: r, isLoading, error, dataUpdatedAt } = useDepotReport();

  if (isLoading) return <div className="ops-page"><p className="ops-muted">Loading depot figures…</p></div>;
  if (error) return <div className="ops-page"><div className="ops-alert bad">{problemMessage(error)}</div></div>;

  const max = Math.max(1, ...r.last7Days.map((d) => Number(d.weightKg)));
  const weekKg = r.last7Days.reduce((s, d) => s + Number(d.weightKg), 0);
  const weekN = r.last7Days.reduce((s, d) => s + d.deliveries, 0);

  return (
    <div className="ops-page">
      <div className="ops-head">
        <h2>{r.depotName}</h2>
        <p>Depot {r.depotCode} · live from the database · updated {new Date(dataUpdatedAt).toLocaleTimeString()}</p>
      </div>

      <div className="ops-stats">
        <div className="agri-card"><span>Deliveries today</span><b>{int(r.today.deliveries)}</b></div>
        <div className="agri-card"><span>Intake today</span><b>{mt(r.today.weightKg)}</b><small>{int(Number(r.today.weightKg) / 50)} bags</small></div>
        <div className="agri-card"><span>Payable today</span><b>{zmw(r.today.amount)}</b></div>
        <div className="agri-card"><span>Rejected today</span><b style={r.rejectedToday ? { color: '#b91c1c' } : undefined}>{int(r.rejectedToday)}</b></div>
      </div>

      <div className="ops-split" style={{ marginTop: 20 }}>
        <div className="agri-card">
          <h3 className="agri-card-title">Last 7 days · {mt(weekKg)} across {int(weekN)} deliveries</h3>
          <div className="ops-bars">
            {r.last7Days.map((d) => (
              <div key={d.date} className="ops-bar" title={`${d.date}: ${kgFmt(d.weightKg)}`}>
                <div className="ops-bar-fill" style={{ height: `${(Number(d.weightKg) / max) * 100}%` }} />
                <small>{dayLabel(d.date)}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="agri-card">
          <h3 className="agri-card-title">By commodity (7 days)</h3>
          {r.byCrop7Days.length === 0 ? <p className="ops-muted">No validated intake yet.</p> : (
            <div className="ops-sum">
              {r.byCrop7Days.map((c) => (
                <div key={c.crop}><span>{c.crop} · {int(c.deliveries)}</span><b>{mt(c.weightKg)} · {zmw(c.amount)}</b></div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <Link to="/officer/intake" className="agri-btn agri-btn-primary">Record crop intake</Link>
        <Link to="/officer/register" className="agri-btn agri-btn-outline">Assist a farmer to register</Link>
      </div>
    </div>
  );
}