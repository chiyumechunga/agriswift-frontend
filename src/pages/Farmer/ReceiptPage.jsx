// src/pages/Farmer/ReceiptPage.jsx
import { useParams, Link } from 'react-router-dom';

export default function FarmerReceiptPage() {
    const { id } = useParams();

    // Simulated API QR code query string for RBAC verification
    const qrApiEndpoint = `https://agriswift.gov.zm/api/v1/deliveries/verify?receiptId=${id || 'REC-2026-0912'}&rbacScope=farmer:read:own`;

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/farmer" className="agri-btn agri-btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>
                    ← Back to Dashboard
                </Link>
                <button onClick={() => window.print()} className="agri-btn agri-btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>
                    Print / Download PDF
                </button>
            </div>

            <div className="agri-card" style={{ padding: '40px', background: '#ffffff', border: '2px solid var(--agri-border)' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--agri-border)', paddingBottom: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--agri-primary)', fontWeight: '800', fontSize: '24px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>agriculture</span>
                        <span>AgriSwift Procurement Receipt</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--agri-text-muted)', marginTop: '4px' }}>
                        Food Reserve Agency (FRA) Official Intake Pass
                    </p>
                </div>

                {/* Details Table */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px', marginBottom: '32px' }}>
                    <div>
                        <span style={{ fontSize: '11px', color: 'var(--agri-text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Receipt ID</span>
                        <p style={{ fontWeight: '800', fontSize: '16px', color: 'var(--agri-primary)' }}>{id || 'REC-2026-0912'}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '11px', color: 'var(--agri-text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Date & Time</span>
                        <p style={{ fontWeight: '600' }}>04 Oct 2026 · 11:24 CAT</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '11px', color: 'var(--agri-text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Farmer Name / NRC</span>
                        <p style={{ fontWeight: '600' }}>Chiyume Chunga</p>
                        <p style={{ fontSize: '12px', color: 'var(--agri-text-muted)' }}>NRC: 293841/61/1</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '11px', color: 'var(--agri-text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Intake Depot</span>
                        <p style={{ fontWeight: '600' }}>Monze Central Silos</p>
                        <p style={{ fontSize: '12px', color: 'var(--agri-text-muted)' }}>Southern Province</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '11px', color: 'var(--agri-text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Commodity Grade</span>
                        <p style={{ fontWeight: '600' }}>White Maize (Grade A)</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '11px', color: 'var(--agri-text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Net Moisture Content</span>
                        <p style={{ fontWeight: '600', color: '#166534' }}>11.8% (Approved)</p>
                    </div>
                </div>

                {/* Total Settlement Box */}
                <div style={{ background: 'var(--agri-bg)', padding: '20px', borderRadius: 'var(--agri-radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--agri-text-muted)' }}>NET WEIGHT ACCEPTED</span>
                        <h3 style={{ fontSize: '24px', fontWeight: '800' }}>3,200 kg</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--agri-primary)' }}>PAYOUT AMOUNT</span>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--agri-primary)' }}>ZMW 16,000</h3>
                    </div>
                </div>

                {/* Verification QR Code Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--agri-border)', paddingTop: '20px' }}>
                    <div style={{ padding: '12px', background: '#ffffff', border: '1px solid var(--agri-border)', borderRadius: 'var(--agri-radius-md)' }}>
                        <svg width="128" height="128" viewBox="0 0 100 100" fill="none">
                            <rect width="100" height="100" fill="#ffffff" />
                            {/* Standard SVG QR Representation */}
                            <path d="M0 0h35v35H0V0zm5 5v25h25V5H5zm5 5h15v15H10V10zm55-10h35v35H65V0zm5 5v25h25V5H70zm5 5h15v15H75V10zM0 65h35v35H0V65zm5 5v25h25V70H5zm5 5h15v15H10V75zm45-10h10v10H55V65zm15 0h10v10H70V65zm20 0h10v10H90V65zm-35 15h10v10H55V80zm20 0h10v10H75V80zm15 0h10v10H90V80zm-35 15h10v10H55V95zm15 0h10v10H70V95zm20 0h10v10H90V95z" fill="#005a2b" />
                        </svg>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--agri-text-muted)', textAlign: 'center', maxWidth: '380px' }}>
                        Scan QR code to query the backend API (<code style={{ fontSize: '10px' }}>{qrApiEndpoint}</code>). Access level permissions dictate dataset visibility.
                    </p>
                </div>
            </div>
        </div>
    );
}