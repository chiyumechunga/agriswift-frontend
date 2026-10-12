import React, { useState, useMemo } from 'react';

// Comprehensive mock data spanning multiple marketing seasons
const DELIVERY_HISTORY = [
    {
        id: 'REC-2026-0912', season: '2026/2027 Season', date: '2026-10-04',
        depot: 'Monze Central Silos', province: 'Southern Province', crop: 'White Maize (Grade A)',
        weightKg: 3200, bagsCount: 64, moisture: '11.8%', payoutAmount: 16000,
        status: 'PAID', payoutChannel: 'MTN Mobile Money', accountNumber: '096***3456', txnRef: 'NFS-MTN-998210',
    },
    {
        id: 'REC-2026-0884', season: '2026/2027 Season', date: '2026-09-21',
        depot: 'Choma Regional Depot', province: 'Southern Province', crop: 'Soybeans',
        weightKg: 1100, bagsCount: 22, moisture: '10.5%', payoutAmount: 8800,
        status: 'PAID', payoutChannel: 'Airtel Money', accountNumber: '097***8901', txnRef: 'NFS-ATL-441209',
    },
    {
        id: 'REC-2026-0810', season: '2026/2027 Season', date: '2026-09-10',
        depot: 'Monze Central Silos', province: 'Southern Province', crop: 'White Maize (Grade B)',
        weightKg: 2400, bagsCount: 48, moisture: '12.4%', payoutAmount: 11520,
        status: 'PROCESSING', payoutChannel: 'Zanaco Bank', accountNumber: '1002****81023', txnRef: 'NFS-PENDING',
    },
    {
        id: 'REC-2025-0412', season: '2025/2026 Season', date: '2025-08-14',
        depot: 'Monze Central Silos', province: 'Southern Province', crop: 'White Maize (Grade A)',
        weightKg: 4500, bagsCount: 90, moisture: '11.2%', payoutAmount: 22500,
        status: 'PAID', payoutChannel: 'MTN Mobile Money', accountNumber: '096***3456', txnRef: 'NFS-MTN-330192',
    },
    {
        id: 'REC-2025-0310', season: '2025/2026 Season', date: '2025-07-29',
        depot: 'Mazabuka Agro Hub', province: 'Southern Province', crop: 'Sunflower',
        weightKg: 1800, bagsCount: 36, moisture: '9.8%', payoutAmount: 12600,
        status: 'PAID', payoutChannel: 'MTN Mobile Money', accountNumber: '096***3456', txnRef: 'NFS-MTN-120984',
    },
    {
        id: 'REC-2024-0105', season: '2024/2025 Season', date: '2024-09-02',
        depot: 'Monze Central Silos', province: 'Southern Province', crop: 'White Maize (Grade A)',
        weightKg: 5000, bagsCount: 100, moisture: '12.0%', payoutAmount: 23000,
        status: 'PAID', payoutChannel: 'Zanaco Bank', accountNumber: '1002****81023', txnRef: 'NFS-ZAN-001294',
    },
];

export default function Records() {
    const [selectedSeason, setSelectedSeason] = useState('ALL');
    const [selectedCrop, setSelectedCrop] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const seasons = useMemo(() => ['ALL', ...new Set(DELIVERY_HISTORY.map((item) => item.season))], []);
    const cropTypes = useMemo(() => ['ALL', ...new Set(DELIVERY_HISTORY.map((item) => item.crop.split(' (')[0]))], []);

    const filteredRecords = useMemo(() => {
        return DELIVERY_HISTORY.filter((record) => {
            const matchesSeason = selectedSeason === 'ALL' || record.season === selectedSeason;
            const matchesCrop = selectedCrop === 'ALL' || record.crop.startsWith(selectedCrop);
            const matchesSearch =
                record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.depot.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.txnRef.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSeason && matchesCrop && matchesSearch;
        });
    }, [selectedSeason, selectedCrop, searchTerm]);

    const totals = useMemo(() => {
        const totalKg = filteredRecords.reduce((acc, curr) => acc + curr.weightKg, 0);
        const totalPayout = filteredRecords.reduce((acc, curr) => acc + curr.payoutAmount, 0);
        const totalBags = filteredRecords.reduce((acc, curr) => acc + curr.bagsCount, 0);
        const paidCount = filteredRecords.filter((r) => r.status === 'PAID').length;
        return {
            metricTons: (totalKg / 1000).toFixed(2),
            kwacha: totalPayout,
            totalBags,
            paidCount,
            totalCount: filteredRecords.length,
        };
    }, [filteredRecords]);

    const groupedBySeason = useMemo(() => {
        return filteredRecords.reduce((acc, record) => {
            if (!acc[record.season]) acc[record.season] = [];
            acc[record.season].push(record);
            return acc;
        }, {});
    }, [filteredRecords]);

    const resetFilters = () => {
        setSelectedSeason('ALL');
        setSelectedCrop('ALL');
        setSearchTerm('');
    };

    return (
        <AppShell title="Historical Delivery Ledger" sub="Lifetime record of crop sales, weighbridge tickets, and settlement payouts">
            
            {/* Filter Bar */}
            <Panel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
                    <div>
                        <label className="agri-label">Marketing Season</label>
                        <select className="agri-select" value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
                            {seasons.map((s) => (
                                <option key={s} value={s}>{s === 'ALL' ? 'All Marketing Seasons' : s}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="agri-label">Crop Commodity</label>
                        <select className="agri-select" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                            {cropTypes.map((c) => (
                                <option key={c} value={c}>{c === 'ALL' ? 'All Commodities' : c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="agri-label">Search Receipts / Depots</label>
                        <div className="agri-search-wrap">
                            <Icon name="search" size={16} />
                            <input
                                className="agri-input agri-input-search"
                                type="text"
                                placeholder="Search Receipt ID, Depot..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Panel>

            {/* Summary Metrics */}
            <div className="agri-stat-grid">
                <Stat label="Total Volume Delivered" value={`${totals.metricTons} MT`} foot={`${totals.totalBags} bags (50kg std)`} icon="scale" />
                <Stat label="Cumulative Earnings" value={`ZMW ${nf(totals.kwacha)}`} foot="Instant NFS disbursals" icon="wallet" tone="accent" />
                <Stat label="Settled Deliveries" value={`${totals.paidCount} / ${totals.totalCount}`} foot="100% verified tickets" icon="checkCircle" tone="info" />
            </div>

            {/* Timeline Delivery List */}
            {filteredRecords.length === 0 ? (
                <Panel>
                    <Empty 
                        title="No Delivery Records Match" 
                        msg="Try clearing your search terms or changing your season filter." 
                        icon="truck"
                        action={
                            <button className="agri-btn agri-btn-outline" onClick={resetFilters}>
                                Reset All Filters
                            </button>
                        }
                    />
                </Panel>
            ) : (
                Object.keys(groupedBySeason).map((seasonKey) => (
                    <div key={seasonKey} style={{ marginBottom: '24px' }}>
                        {/* Season Group Banner */}
                        <div className="agri-flex" style={{ gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                            <Icon name="calendar" size={20} style={{ color: 'var(--agri-primary)' }} />
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--agri-text-dark)', margin: 0 }}>
                                {seasonKey}
                            </h3>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--agri-border)' }} />
                        </div>

                        {/* Deliveries within this season */}
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {groupedBySeason[seasonKey].map((record) => (
                                <Panel key={record.id} tight>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                                            
                                            {/* Left Info: ID & Commodity */}
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                                <div style={{
                                                    width: '48px', height: '48px', borderRadius: 'var(--agri-radius-md)',
                                                    backgroundColor: 'var(--agri-primary-light)', color: 'var(--agri-primary)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                }}>
                                                    <Icon name="leaf" size={24} />
                                                </div>

                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--agri-text-dark)' }}>
                                                            {record.id}
                                                        </span>
                                                        <span style={{
                                                            padding: '2px 8px', borderRadius: 'var(--agri-radius-full)', fontSize: '11px', fontWeight: '800',
                                                            backgroundColor: record.status === 'PAID' ? 'var(--agri-success-light)' : 'var(--agri-secondary-light)',
                                                            color: record.status === 'PAID' ? 'var(--agri-success)' : '#b45309',
                                                        }}>
                                                            {record.status}
                                                        </span>
                                                    </div>

                                                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px', color: 'var(--agri-primary)' }}>
                                                        {record.crop}
                                                    </h4>

                                                    <p style={{ fontSize: '13px', color: 'var(--agri-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Icon name="globe" size={14} />
                                                        {record.depot} ({record.province}) · Delivered on {record.date}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Info: Weight & Payout */}
                                            <div style={{ textAlign: 'right', minWidth: '160px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--agri-text-muted)' }}>PAYOUT VALUE</span>
                                                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--agri-text-dark)' }}>
                                                    ZMW {nf(record.payoutAmount)}
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--agri-primary)' }}>
                                                    {nf(record.weightKg)} kg ({record.bagsCount} bags @ 50kg)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer row: Moisture, Payment channel details, QR action button */}
                                        <div style={{
                                            marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--agri-border)',
                                            display: 'flex', justifyContent: 'space-between', /* FIXED: was 'justify' */
                                            alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px',
                                        }}>
                                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: 'var(--agri-text-muted)' }}>
                                                <span><strong>Moisture:</strong> {record.moisture}</span>
                                                <span><strong>Channel:</strong> {record.payoutChannel} ({record.accountNumber})</span>
                                                <span>
                                                    <strong>Ref:</strong> 
                                                    <code className="agri-mono" style={{ fontSize: '12px', background: 'var(--agri-bg)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>
                                                        {record.txnRef}
                                                    </code>
                                                </span>
                                            </div>

                                            <A to={`/app/receipt/${record.id}`} className="agri-btn agri-btn-primary agri-btn-sm" style={{ gap: '6px' }}>
                                                <Icon name="qr" size={16} />
                                                View Receipt & QR
                                            </A>
                                        </div>
                                    </div>
                                </Panel>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </AppShell>
    );
}