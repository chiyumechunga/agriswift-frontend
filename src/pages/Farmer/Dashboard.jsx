import { useAuth } from '../../context/AuthContext';
import { useFarmerDashboard } from '../../hooks/useFarmerDashboard';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();
    // Safely access user?.id to prevent crashes during auth initialization
    const { data, isLoading, isError } = useFarmerDashboard(user?.id);

    if (isLoading) return <div className="state-msg">Loading dashboard...</div>;
    if (isError) return <div className="state-msg error">Failed to load data. Please check your connection.</div>;
    if (!data) return null;

    const { entitlement, recentDelivery, payoutSteps = [] } = data;

    return (
        <div className="dash-grid">
            {entitlement && (
                <section className="card">
                    <div className="card-header">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                        <h2 className="card-title">Current Entitlement</h2>
                    </div>
                    <p className="entitlement-val">
                        {entitlement.currency} {entitlement.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="sub-text">Available for payout</p>
                </section>
            )}

            {recentDelivery && (
                <section className="card">
                    <div className="delivery-header">
                        <div>
                            <h2 className="title-md">Recent Delivery</h2>
                            <p className="sub-text">{recentDelivery.depot}</p>
                            <p className="sub-text sm">Ref: {recentDelivery.ref}</p>
                        </div>
                        <div className="badge pill">
                            <span className="material-symbols-outlined">water_drop</span>
                            Moisture Verified {recentDelivery.moisture}%
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="row-between">
                        <div>
                            <p className="sub-text sm">Quantity</p>
                            <p className="data-mono">{recentDelivery.quantity} MT</p>
                        </div>
                        <div className="text-right">
                            <p className="sub-text sm">Grade</p>
                            <p className="data-mono">{recentDelivery.grade}</p>
                        </div>
                    </div>
                </section>
            )}

            <section className="card">
                <h2 className="title-md mb-md">Payout Status</h2>
                <div className="timeline">
                    {payoutSteps.map(step => (
                        <div key={step.id} className="timeline-item">
                            <div className={`timeline-node ${step.status}`}>
                                {step.status === 'completed' && <span className="material-symbols-outlined">check</span>}
                                {step.status === 'pending' && <div className="pulse-dot-alt"></div>}
                            </div>
                            <div className="timeline-content">
                                <p className={`step-label ${step.status}`}>{step.label}</p>
                                <p className="sub-text sm">{step.date} {step.location && `- ${step.location}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <button className="btn-action">
                <span className="material-symbols-outlined">payments</span> Select Payout Channel
            </button>
        </div>
    );
}