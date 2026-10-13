// src/pages/Farmer/FarmerDashboard.jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  useDeliveryHistory,
  useInitiateSimulatedPayment,
  usePaymentAccounts,
  usePaymentProgress,
} from '../../hooks/useFarmerPortal';


const money = new Intl.NumberFormat('en-ZM', {
  style: 'currency',
  currency: 'ZMW',
  maximumFractionDigits: 2,
});

const whole = new Intl.NumberFormat('en-ZM', {
  maximumFractionDigits: 0,
});

const kg = (value) => `${whole.format(Number(value ?? 0))} kg`;
const tonnes = (value) => `${(Number(value ?? 0) / 1000).toLocaleString('en-ZM', { maximumFractionDigits: 2 })} MT`;
const amount = (value) => money.format(Number(value ?? 0));
const date = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-ZM', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}) : '—';

const userMessage = (error) => {
  const body = error?.response?.data;
  return body?.detail || body?.message || body?.title
    || (error?.response ? `Request failed (${error.response.status}).` : 'Unable to reach AgriSwift.');
};

const paymentClass = (status) => {
  if (status === 'SUCCEEDED' || status === 'ACKNOWLEDGED') return 'farmer-status success';
  if (status === 'FAILED') return 'farmer-status failure';
  return 'farmer-status pending';
};

function PaymentProgress({ paymentId, onClose }) {
  const { data: payment, isLoading, error } = usePaymentProgress(paymentId);

  if (isLoading) {
    return <div className="farmer-inline-note">Starting payment simulation…</div>;
  }

  if (error) {
    return (
      <div className="farmer-alert error">
        Could not retrieve payment status: {userMessage(error)}
        <button type="button" className="farmer-text-button" onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <section className="farmer-payment-progress" aria-live="polite">
      <div className="farmer-progress-heading">
        <div>
          <span className="farmer-eyebrow">Simulation status</span>
          <h3>{amount(payment.amount)} · {payment.status}</h3>
        </div>
        <button type="button" className="farmer-text-button" onClick={onClose}>Close</button>
      </div>

      <p className="farmer-muted">
        This is a demonstration payment. No real money is sent to a bank or mobile-money wallet.
      </p>

      <ol className="farmer-timeline">
        {(payment.events ?? []).map((event, index) => (
          <li key={`${event.status}-${event.occurredAt}-${index}`}>
            <span className="farmer-timeline-dot" />
            <div>
              <strong>{event.status.replaceAll('_', ' ')}</strong>
              <small>{new Date(event.occurredAt).toLocaleString('en-ZM')}</small>
            </div>
          </li>
        ))}
      </ol>

      {payment.failureReason && (
        <div className="farmer-alert error">{payment.failureReason}</div>
      )}
    </section>
  );
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { data: deliveryPage, isLoading: loadingDeliveries, error: deliveryError } =
    useDeliveryHistory({ page: 0, size: 5 });
  const { data: accounts = [], isLoading: loadingAccounts, error: accountError } =
    usePaymentAccounts();
  const initiate = useInitiateSimulatedPayment();

  const [paymentId, setPaymentId] = useState(null);
  const [actionError, setActionError] = useState('');

  const deliveries = deliveryPage?.content ?? [];
  const preferredAccount = accounts.find((account) => account.preferred);

  const totals = useMemo(() => {
    const validated = deliveries.filter((delivery) => delivery.validationStatus === 'VALIDATED');
    return {
      validatedWeightKg: validated.reduce((sum, delivery) => sum + Number(delivery.weightKg ?? 0), 0),
      availableAmount: validated.reduce((sum, delivery) => sum + Number(delivery.amount ?? 0), 0),
      deliveryCount: validated.length,
    };
  }, [deliveries]);

  const startPayment = (entitlementId) => {
    setActionError('');
    initiate.mutate(entitlementId, {
      onSuccess: (payment) => setPaymentId(payment.paymentId),
      onError: (error) => setActionError(userMessage(error)),
    });
  };

  return (
    <div className="farmer-page">
      <header className="farmer-page-head">
        <div>
          <span className="farmer-eyebrow">Farmer workspace</span>
          <h1>Welcome, {user?.name || 'Farmer'}</h1>
          <p>Track deliveries, receipts and simulated payment processing in one place.</p>
        </div>
        <div className="farmer-mode-badge">
          <span className="material-symbols-outlined">science</span>
          Payment simulation
        </div>
      </header>

      {!loadingAccounts && !preferredAccount && (
        <section className="farmer-alert warning">
          <div>
            <strong>Complete your payout setup</strong>
            <p>Add and select a preferred mobile-money wallet or bank account before starting a payment simulation.</p>
          </div>
          <Link className="farmer-button secondary" to="/farmer/registration">
            Complete setup
          </Link>
        </section>
      )}

      {accountError && (
        <div className="farmer-alert error">
          Could not load payout-account setup: {userMessage(accountError)}
        </div>
      )}

      <section className="farmer-stats" aria-label="Delivery summary">
        <article className="farmer-stat-card">
          <span>Total validated intake</span>
          <strong>{tonnes(totals.validatedWeightKg)}</strong>
          <small>{whole.format(totals.deliveryCount)} recent validated deliveries</small>
        </article>
        <article className="farmer-stat-card">
          <span>Available for simulation</span>
          <strong>{amount(totals.availableAmount)}</strong>
          <small>Calculated from loaded validated deliveries</small>
        </article>
        <article className="farmer-stat-card">
          <span>Payout account</span>
          <strong>{preferredAccount ? 'Configured' : 'Action needed'}</strong>
          <small>
            {preferredAccount
              ? `${preferredAccount.providerName} · ${preferredAccount.maskedAccountNumber}`
              : 'No preferred account selected'}
          </small>
        </article>
      </section>

      {paymentId && (
        <PaymentProgress paymentId={paymentId} onClose={() => setPaymentId(null)} />
      )}

      <section className="farmer-panel">
        <div className="farmer-panel-head">
          <div>
            <span className="farmer-eyebrow">Deliveries</span>
            <h2>Recent crop deliveries</h2>
          </div>
          <Link to="/farmer/records" className="farmer-button ghost">
            View all history
          </Link>
        </div>

        {actionError && <div className="farmer-alert error">{actionError}</div>}

        {loadingDeliveries && <p className="farmer-muted">Loading deliveries from AgriSwift…</p>}

        {deliveryError && (
          <div className="farmer-alert error">
            Could not load deliveries: {userMessage(deliveryError)}
          </div>
        )}

        {!loadingDeliveries && !deliveryError && deliveries.length === 0 && (
          <div className="farmer-empty-state">
            <span className="material-symbols-outlined">agriculture</span>
            <h3>No deliveries yet</h3>
            <p>Your recorded crop deliveries will appear here after an FRA officer completes intake.</p>
          </div>
        )}

        {!loadingDeliveries && deliveries.length > 0 && (
          <div className="farmer-table-wrap">
            <table className="farmer-table">
              <thead>
                <tr>
                  <th>Delivery</th>
                  <th>Crop and weight</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => {
                  const payable = delivery.validationStatus === 'VALIDATED'
                    && Number(delivery.amount ?? 0) > 0;

                  return (
                    <tr key={delivery.entitlementId}>
                      <td>
                        <strong>{date(delivery.deliveryDate)}</strong>
                        <small>{delivery.depotName}</small>
                        {delivery.receiptSerialNumber && (
                          <small className="farmer-receipt">{delivery.receiptSerialNumber}</small>
                        )}
                      </td>
                      <td>
                        <strong>{delivery.cropName}</strong>
                        <small>{kg(delivery.weightKg)}</small>
                      </td>
                      <td><strong>{amount(delivery.amount)}</strong></td>
                      <td>
                        <span className={paymentClass(delivery.validationStatus === 'VALIDATED' ? 'SUCCEEDED' : 'PENDING')}>
                          {delivery.validationStatus.replaceAll('_', ' ')}
                        </span>
                      </td>
                      <td className="farmer-actions">
                        {delivery.receiptId && (
                          <Link
                            className="farmer-text-button"
                            to={`/farmer/receipt/${delivery.receiptId}`}
                          >
                            Receipt
                          </Link>
                        )}
                        {payable && (
                          <button
                            type="button"
                            className="farmer-text-button primary"
                            disabled={!preferredAccount || initiate.isPending}
                            onClick={() => startPayment(delivery.entitlementId)}
                          >
                            {initiate.isPending ? 'Starting…' : 'Simulate payment'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}