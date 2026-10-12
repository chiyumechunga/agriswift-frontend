// src/pages/FRA/FRADashboard.jsx
import { useState } from 'react';

export default function FRADashboard() {
    const [activeTab, setActiveTab] = useState('intake'); // 'intake' | 'ekyc' | 'admin'

    // Crop Intake Form State
    const [farmerNrc, setFarmerNrc] = useState('');
    const [commodity, setCommodity] = useState('White Maize (Grade A)');
    const [bags, setBags] = useState('');
    const [grossWeight, setGrossWeight] = useState('');
    const [moisture, setMoisture] = useState('');
    const [intakeSuccess, setIntakeSuccess] = useState(false);

    // eKYC Assisted Registration State
    const [regName, setRegName] = useState('');
    const [regNrc, setRegNrc] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regDistrict, setRegDistrict] = useState('Monze');
    const [kycSuccess, setKycSuccess] = useState(false);

    const handleIntakeSubmit = (e) => {
        e.preventDefault();
        setIntakeSuccess(true);
        setTimeout(() => setIntakeSuccess(false), 4000);
        setFarmerNrc('');
        setGrossWeight('');
        setBags('');
        setMoisture('');
    };

    const handleEkycSubmit = (e) => {
        e.preventDefault();
        setKycSuccess(true);
        setTimeout(() => setKycSuccess(false), 4000);
        setRegName('');
        setRegNrc('');
        setRegPhone('');
    };

    return (
        <div style={{ display: 'grid', gap: '28px' }}>
            {/* Header & Mode Selectors */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 className="agri-section-title" style={{ fontSize: '26px', margin: 0 }}>FRA Depot Operations</h2>
                    <p style={{ color: 'var(--agri-text-muted)', fontSize: '14px' }}>Assigned Station: Monze Central Silos · Southern Region</p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className={`agri-btn ${activeTab === 'intake' ? 'agri-btn-primary' : 'agri-btn-outline'}`}
                        onClick={() => setActiveTab('intake')}
                    >
                        <span className="material-symbols-outlined">scale</span> Crop Intake
                    </button>
                    <button
                        className={`agri-btn ${activeTab === 'ekyc' ? 'agri-btn-secondary' : 'agri-btn-outline'}`}
                        onClick={() => setActiveTab('ekyc')}
                    >
                        <span className="material-symbols-outlined">person_add</span> Assisted eKYC
                    </button>
                    <button
                        className={`agri-btn ${activeTab === 'admin' ? 'agri-btn-primary' : 'agri-btn-outline'}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        <span className="material-symbols-outlined">admin_panel_settings</span> Station Admin
                    </button>
                </div>
            </div>

            {/* TAB 1: WEIGHBRIDGE CROP INTAKE */}
            {activeTab === 'intake' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px' }}>
                    <div className="agri-card">
                        <h3 className="agri-card-title">Record Crop Delivery Intake</h3>
                        <form onSubmit={handleIntakeSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '13px', fontWeight: '700' }}>Farmer NRC Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 293841/61/1"
                                    value={farmerNrc}
                                    onChange={(e) => setFarmerNrc(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '700' }}>Commodity Grade</label>
                                <select
                                    value={commodity}
                                    onChange={(e) => setCommodity(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                >
                                    <option value="White Maize (Grade A)">White Maize (Grade A)</option>
                                    <option value="White Maize (Grade B)">White Maize (Grade B)</option>
                                    <option value="Soybeans">Soybeans</option>
                                    <option value="Sunflower">Sunflower</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '700' }}>Number of 50kg Bags</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 64"
                                    value={bags}
                                    onChange={(e) => setBags(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '700' }}>Net Weight (KG)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 3200"
                                    value={grossWeight}
                                    onChange={(e) => setGrossWeight(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '700' }}>Measured Moisture (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    placeholder="e.g. 11.8 (Max limit 12.5%)"
                                    value={moisture}
                                    onChange={(e) => setMoisture(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
                                <button type="submit" className="agri-btn agri-btn-primary agri-btn-lg" style={{ width: '100%' }}>
                                    Approve Intake &amp; Trigger Disbursal
                                </button>
                            </div>
                        </form>

                        {intakeSuccess && (
                            <div style={{ marginTop: '16px', padding: '16px', background: '#dcfce7', color: '#166534', borderRadius: 'var(--agri-radius-md)', fontWeight: '700' }}>
                                Delivery successfully logged! Receipt ticket generated and queued for instant settlement.
                            </div>
                        )}
                    </div>

                    <div className="agri-card">
                        <h3 className="agri-card-title">Station Live Status</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                            <div>
                                <span style={{ fontSize: '12px', color: 'var(--agri-text-muted)' }}>Silo Capacity Used</span>
                                <p style={{ fontWeight: '800', fontSize: '18px' }}>14,200 / 20,000 MT (71%)</p>
                            </div>
                            <div>
                                <span style={{ fontSize: '12px', color: 'var(--agri-text-muted)' }}>Today's Intake Count</span>
                                <p style={{ fontWeight: '800', fontSize: '18px', color: 'var(--agri-primary)' }}>28 Deliveries</p>
                            </div>
                            <div>
                                <span style={{ fontSize: '12px', color: 'var(--agri-text-muted)' }}>Offline Sync Queue</span>
                                <p style={{ fontWeight: '700', fontSize: '14px', color: '#b45309' }}>0 items pending sync</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: ASSISTED eKYC FARMER REGISTRATION */}
            {activeTab === 'ekyc' && (
                <div className="agri-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
                    <h3 className="agri-card-title">Assisted Farmer Onboarding (eKYC)</h3>
                    <p style={{ fontSize: '13px', color: 'var(--agri-text-muted)', marginBottom: '20px' }}>
                        Register farmers directly on the national procurement ledger when they are unable to self-register.
                    </p>

                    <form onSubmit={handleEkycSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700' }}>Full Legal Name</label>
                            <input
                                type="text"
                                required
                                placeholder="First & Last Name"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700' }}>NRC Number</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 123456/78/1"
                                value={regNrc}
                                onChange={(e) => setRegNrc(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700' }}>Mobile Money Number</label>
                            <input
                                type="text"
                                required
                                placeholder="096 / 097 / 095"
                                value={regPhone}
                                onChange={(e) => setRegPhone(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700' }}>Farm District</label>
                            <select
                                value={regDistrict}
                                onChange={(e) => setRegDistrict(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--agri-radius-sm)', border: '1px solid var(--agri-border)', marginTop: '4px' }}
                            >
                                <option value="Monze">Monze</option>
                                <option value="Choma">Choma</option>
                                <option value="Chipata">Chipata</option>
                                <option value="Kasama">Kasama</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
                            <button type="submit" className="agri-btn agri-btn-secondary agri-btn-lg" style={{ width: '100%' }}>
                                Verify INRIS &amp; Register Farmer
                            </button>
                        </div>
                    </form>

                    {kycSuccess && (
                        <div style={{ marginTop: '16px', padding: '16px', background: '#dcfce7', color: '#166534', borderRadius: 'var(--agri-radius-md)', fontWeight: '700' }}>
                            eKYC verification completed! Farmer is now registered and eligible for immediate grain payouts.
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: STATION ADMIN */}
            {activeTab === 'admin' && (
                <div className="agri-card">
                    <h3 className="agri-card-title">Station Administrative Tasks</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '16px' }}>
                        <div style={{ padding: '16px', border: '1px solid var(--agri-border)', borderRadius: 'var(--agri-radius-md)' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Moisture Scale Calibration</h4>
                            <p style={{ fontSize: '13px', color: 'var(--agri-text-muted)', margin: '8px 0 16px 0' }}>
                                Last calibrated today at 07:00 CAT.
                            </p>
                            <button className="agri-btn agri-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                Recalibrate Scale
                            </button>
                        </div>

                        <div style={{ padding: '16px', border: '1px solid var(--agri-border)', borderRadius: 'var(--agri-radius-md)' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Silo Allocation Management</h4>
                            <p style={{ fontSize: '13px', color: 'var(--agri-text-muted)', margin: '8px 0 16px 0' }}>
                                Silo Bay 3 assigned for Maize Grade A.
                            </p>
                            <button className="agri-btn agri-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                Reassign Bays
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}