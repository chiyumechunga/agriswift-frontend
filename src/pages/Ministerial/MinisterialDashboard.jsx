// src/pages/Ministerial/MinisterialDashboard.jsx
export default function MinisterialDashboard() {
    const auditLogs = [
        { id: 'AUD-8821', timestamp: '2026-10-09 12:44:10', user: 'OFC-Monze-04', action: 'CROP_INTAKE_RECORD', scope: 'Monze Central Silos', status: 'VERIFIED' },
        { id: 'AUD-8820', timestamp: '2026-10-09 12:40:02', user: 'SYSTEM_NFS', action: 'DISBURSE_SETTLEMENT', scope: 'Airtel Money / ZMW 16,000', status: 'SUCCESS' },
        { id: 'AUD-8819', timestamp: '2026-10-09 11:15:33', user: 'OFC-Chipata-02', action: 'EKYC_FARMER_REG', scope: 'NRC 892341/11/1', status: 'AUDITED' },
        { id: 'AUD-8818', timestamp: '2026-10-09 10:02:18', user: 'OFC-Kasama-01', action: 'MOISTURE_REJECTION', scope: 'Kasama Storage (14.2%)', status: 'FLAGGED' },
    ];

    return (
        <div style={{ display: 'grid', gap: '32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 className="agri-section-title" style={{ fontSize: '28px', margin: 0 }}>National Reserve &amp; Financial Audit Hub</h2>
                    <p style={{ color: 'var(--agri-text-muted)', fontSize: '14px' }}>Ministry of Agriculture &amp; Ministry of Finance Joint Executive Portal</p>
                </div>
                <button className="agri-btn agri-btn-primary">
                    <span className="material-symbols-outlined">download</span> Download Audit CSV
                </button>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div className="agri-card" style={{ borderTop: '4px solid var(--agri-primary)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--agri-text-muted)' }}>NATIONAL GRAIN RESERVES</span>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>184,200 MT</h3>
                    <p style={{ fontSize: '12px', color: 'var(--agri-primary)', fontWeight: '700' }}>+14.2% vs 2025 Reserve Quota</p>
                </div>

                <div className="agri-card" style={{ borderTop: '4px solid var(--agri-secondary)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--agri-text-muted)' }}>DISBURSED FUNDS (NFS)</span>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>ZMW 921.0M</h3>
                    <p style={{ fontSize: '12px', color: 'var(--agri-secondary)', fontWeight: '700' }}>Sub-45s Disbursal Speed</p>
                </div>

                <div className="agri-card" style={{ borderTop: '4px solid #1e3a8a' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--agri-text-muted)' }}>REGISTERED FARMERS</span>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>312,450</h3>
                    <p style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: '700' }}>94.1% eKYC Verified</p>
                </div>
            </div>

            {/* Audit Log Stream */}
            <div className="agri-card">
                <h3 className="agri-card-title" style={{ marginBottom: '16px' }}>Real-Time System Audit Stream</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--agri-border)', color: 'var(--agri-text-muted)' }}>
                                <th style={{ padding: '12px' }}>Audit ID</th>
                                <th style={{ padding: '12px' }}>Timestamp</th>
                                <th style={{ padding: '12px' }}>Actor / Officer</th>
                                <th style={{ padding: '12px' }}>Action</th>
                                <th style={{ padding: '12px' }}>Scope / Reference</th>
                                <th style={{ padding: '12px' }}>Audit Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditLogs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid var(--agri-border)' }}>
                                    <td style={{ padding: '12px', fontWeight: '700' }}>{log.id}</td>
                                    <td style={{ padding: '12px', color: 'var(--agri-text-muted)' }}>{log.timestamp}</td>
                                    <td style={{ padding: '12px', fontWeight: '600' }}>{log.user}</td>
                                    <td style={{ padding: '12px' }}>
                                        <code style={{ background: 'var(--agri-bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                                            {log.action}
                                        </code>
                                    </td>
                                    <td style={{ padding: '12px' }}>{log.scope}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            fontWeight: '800',
                                            fontSize: '11px',
                                            color: log.status === 'FLAGGED' ? '#b45309' : '#166534'
                                        }}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}