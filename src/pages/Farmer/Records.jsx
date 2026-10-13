// src/pages/Farmer/Records.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeliveryHistory } from '../../hooks/useFarmerPortal.js';

const PAGE_SIZE = 20;

const moneyFormatter = new Intl.NumberFormat('en-ZM', {
  style: 'currency',
  currency: 'ZMW',
  maximumFractionDigits: 2,
});

const weightFormatter = new Intl.NumberFormat('en-ZM', {
  maximumFractionDigits: 2,
});

function formatMoney(value) {
  return value == null ? '—' : moneyFormatter.format(Number(value));
}

function formatWeight(value) {
  return value == null
    ? '—'
    : `${weightFormatter.format(Number(value))} kg`;
}

function formatDate(value) {
  if (!value) return '—';

  const parsed = new Date(`${value}T00:00:00`);

  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
}

function errorMessage(error) {
  const body = error?.response?.data;

  return body?.detail
    || body?.message
    || body?.title
    || 'Unable to load your delivery history.';
}

function statusClass(status) {
  if (status === 'VALIDATED') return 'farmer-status success';
  if (status === 'REJECTED') return 'farmer-status failure';
  return 'farmer-status pending';
}

export default function Records() {
  const [page, setPage] = useState(0);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useDeliveryHistory({
    page,
    size: PAGE_SIZE,
  });

  const deliveries = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="farmer-page">
      <header className="farmer-page-head">
        <div>
          <span className="farmer-eyebrow">Your records</span>
          <h1>Delivery history</h1>
          <p>
            Review your recorded crop deliveries and open their issued receipts.
          </p>
        </div>

        <Link to="/farmer" className="farmer-button ghost">
          Back to overview
        </Link>
      </header>

      <section className="farmer-panel">
        <div className="farmer-panel-head">
          <div>
            <span className="farmer-eyebrow">Crop intake records</span>
            <h2>
              {data
                ? `${totalElements.toLocaleString()} recorded ${
                    totalElements === 1 ? 'delivery' : 'deliveries'
                  }`
                : 'Your deliveries'}
            </h2>
          </div>

          <button
            type="button"
            className="farmer-button ghost"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="farmer-alert error" role="alert">
            <span>{errorMessage(error)}</span>
            <button
              type="button"
              className="farmer-text-button"
              disabled={isFetching}
              onClick={() => refetch()}
            >
              Try again
            </button>
          </div>
        )}

        {isLoading && (
          <p className="farmer-muted" role="status">
            Loading delivery history…
          </p>
        )}

        {!isLoading && !error && deliveries.length === 0 && (
          <div className="farmer-empty-state">
            <h3>No deliveries on this page</h3>
            <p>
              {page === 0
                ? 'Your deliveries will appear here after an FRA officer records your crop intake.'
                : 'Return to the previous page to view your records.'}
            </p>
          </div>
        )}

        {!isLoading && deliveries.length > 0 && (
          <div className="farmer-table-wrap">
            <table className="farmer-table">
              <caption className="records-sr-only">
                Your crop deliveries, validation outcomes and issued receipts
              </caption>

              <thead>
                <tr>
                  <th scope="col">Date and depot</th>
                  <th scope="col">Crop</th>
                  <th scope="col">Net weight</th>
                  <th scope="col">Entitlement amount</th>
                  <th scope="col">Delivery status</th>
                  <th scope="col">Receipt</th>
                </tr>
              </thead>

              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery.entitlementId}>
                    <td>
                      <strong>{formatDate(delivery.deliveryDate)}</strong>
                      <small>{delivery.depotName || '—'}</small>
                    </td>

                    <td>{delivery.cropName || '—'}</td>

                    <td>{formatWeight(delivery.weightKg)}</td>

                    <td>
                      <strong>{formatMoney(delivery.amount)}</strong>
                      <small>Not a payment confirmation</small>
                    </td>

                    <td>
                      <span
                        className={statusClass(delivery.validationStatus)}
                      >
                        {(delivery.validationStatus || 'UNKNOWN')
                          .replaceAll('_', ' ')}
                      </span>
                    </td>

                    <td>
                      {delivery.receiptId ? (
                        <>
                          <Link
                            className="farmer-text-button"
                            to={`/farmer/receipt/${encodeURIComponent(
                              delivery.receiptId,
                            )}`}
                          >
                            View receipt
                          </Link>

                          <small>
                            {delivery.receiptSerialNumber || ''}
                          </small>
                        </>
                      ) : (
                        <span className="farmer-muted">
                          Not issued
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && !error && (
          <div className="records-pagination">
            <p className="farmer-muted" aria-live="polite">
              {totalPages > 0
                ? `Page ${page + 1} of ${totalPages}`
                : 'No records'}
            </p>

            <div className="records-pagination-actions">
              <button
                type="button"
                className="farmer-button ghost"
                disabled={page === 0 || isFetching}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>

              <button
                type="button"
                className="farmer-button ghost"
                disabled={
                  isFetching
                  || totalPages === 0
                  || page + 1 >= totalPages
                }
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}