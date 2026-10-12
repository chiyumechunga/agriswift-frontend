// src/pages/Farmer/FarmerDashboard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FarmerDashboard() {
    const [payoutChannel, setPayoutChannel] = useState('mno'); // 'mno' | 'bank'
    const [mnoProvider, setMnoProvider] = useState('MTN Mobile Money');
    const [mnoNumber, setMnoNumber] = useState('0968123456');
    const [bankName, setBankName] = useState('Zanaco');
    const [accountNumber, setAccountNumber] = useState('1002938481023');
    const [saveNotice, setSaveNotice] = useState(false);

    const recentDeliveries = [
        { id: 'REC-2026-0912', date: '2026-10-04', depot: 'Monze Central Silos', crop: 'White Maize (Grade A)', weight: '3,200 kg', status: 'PAID', amount: 'ZMW 16,000' },
        { id: 'REC-2026-0884', date: '2026-09-21', depot: 'Choma Regional Depot', crop: 'Soybeans', weight: '1,100 kg', status: 'PAID', amount: 'ZMW 8,800' },
        { id: 'REC-2026-0810', date: '2026-09-10', depot: 'Monze Central Silos', crop: 'White Maize (Grade B)', weight: '2,400 kg', status: 'PROCESSING', amount: 'ZMW 11,520' },
    ];

    const handleSaveChannel = (e) => {
        e.preventDefault();
        setSaveNotice(true);
        setTimeout(() => setSaveNotice(false), 3000);
    };

    return (
        <div style={{ display: 'grid', gap: '32px' }}>
            {/* Account Overview Header */}
            <div className="agri-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 className="agri-card-title">Welcome back, Chiyume Chunga</h2>
                    <p style={{ color: 'var(--agri-text-muted)' }}>NRC: 293841/61/1 · ZIAMIS ID: ZM-890123 · Monze District</p>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ background: 'var(--agri-primary-light)', padding: '12px 20px', borderRadius: 'var(--agri-radius-md)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--agri-primary)', fontWeight: '800', letterSpacing: '0.05em' }}>TOTAL DELIVERED</span>
                        <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--agri-primary)' }}>6.7 MT</p>
                    </div>
                    <div style={{ background: 'var(--agri-secondary-light)', padding: '12px 20px', borderRadius: 'var(--agri-radius-md)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--agri-secondary)', fontWeight: '800', letterSpacing: '0.05em' }}>PAID OUT</span>
                        <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--agri-secondary)' }}>ZMW 36,320</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
                {/* Left: Deliveries */}
                <div className="agri-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="agri-card-title" style={{ margin: 0 }}>Recent Crop Deliveries</h3>
                        <Link to="/farmer/records" className="agri-btn agri-btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>
                            View Full History
                        </Link>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--agri-border)', color: 'var(--agri-text-muted)' }}>
                                    <th style={{ padding: '12px 8px' }}>Receipt</th>
                                    <th style={{ padding: '12px 8px' }}>Date / Depot</th>
                                    <th style={{ padding: '12px 8px' }}>Crop / Net Weight</th>
                                    <th style={{ padding: '12px 8px' }}>Payout Status</th>
                                    <th style={{ padding: '12px 8px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentDeliveries.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--agri-border)' }}>
                                        <td style={{ padding: '14px 8px', fontWeight: '700' }}>{item.id}</td>
                                        <td style={{ padding: '14px 8px' }}>
                                            <div>{item.date}</div>
                                            <small style={{ color: 'var(--agri-text-muted)' }}>{item.depot}</small>
                                        </td>
                                        <td style={{ padding: '14px 8px' }}>
                                            <div>{item.crop}</div>
                                            <small style={{ color: 'var(--agri-primary)', fontWeight: '700' }}>{item.weight}</small>
                                        </td>
                                        <td style={{ padding: '14px 8px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: 'var(--agri-radius-full)',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                backgroundColor: item.status === 'PAID' ? '#dcfce7' : '#fef3c7',
                                                color: item.status === 'PAID' ? '#166534' : '#b45309',
                                            }}>
                                                {item.status} · {item.amount}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 8px' }}>
                                            <Link to={`/farmer/receipt/${item.id}`} className="agri-btn agri-btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>
                                                Receipt &amp; QR
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Payment Preference Channel */}
                <div className="agri-card">
                    <h3 className="agri-card-title">Payment Settlement Preference</h3>
                    <p style={{ fontSize: '13px', color: 'var(--agri-text-muted)', marginBottom: '20px' }}>
                        Select your preferred disbursement method for instant grain payouts.
                    </p>

                    <form onSubmit={handleSaveChannel} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '8px' }}>Disbursement Channel</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <button
                                    type="button"
                                    className={`agri-btn ${payoutChannel === 'mno' ? 'agri-btn-primary' : 'agri-btn-outline'}`}
                                    onClick={() => setPayoutChannel('mno')}
                                    style={{ padding: '8px', fontSize: '13px' }}
                                >
                                    Mobile Money Wallet
                                </button>
                                <button
                                    type="button"
                                    className={`agri-btn ${payoutChannel === 'bank' ? 'agri-btn-primary' : 'agri-btn-outline'}`}
                                    onClick={() => setPayoutChannel('bank')}
                                    style={{ padding: '8px', fontSize: '13px' }}
                                >
                                    Bank Account
                                </button>
                            </div>
                        </div>

                        {payoutChannel === 'mno' ? (
                            <>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700' }}>MNO Mobile Wallet Provider</label>
                                    <select
                                        value={mnoProvider}
                                        onChange={(e) => setMnoProvider(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                    >
                                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                                        <option value="Airtel Money">Airtel Money</option>
                                        <option value="Zamtel Kwacha">Zamtel Kwacha</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Mobile Number (NRC Linked)</label>
                                    <input
                                        type="text"
                                        value={mnoNumber}
                                        onChange={(e) => setMnoNumber(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Commercial Bank</label>
                                    <select
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                    >
                                        <option value="Zanaco">Zanaco Commercial Bank</option>
                                        <option value="Atlas Mara">Atlas Mara Zambia</option>
                                        <option value="Absa">Absa Bank Zambia</option>
                                        <option value="Indo-Zambia">Indo-Zambia Bank</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Account Number</label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="agri-btn agri-btn-secondary" style={{ marginTop: '8px' }}>
                            Save Payment Preference
                        </button>

                        {saveNotice && (
                            <p style={{ color: 'var(--agri-primary)', fontSize: '13px', textAlign: 'center', fontWeight: '700' }}>
                                Saved! Active channel updated on AgriSwift settlement engine.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}