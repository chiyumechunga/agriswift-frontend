// src/pages/Farmer/ReceiptPage.jsx
import { Link, useParams } from 'react-router-dom';
import { useDeliveryReceipt } from '../../hooks/useFarmerPortal';


const money = new Intl.NumberFormat('en-ZM', {
  style: 'currency',
  currency: 'ZMW',
  maximumFractionDigits: 2,
});

const problem = (error) => {
  const body = error?.response?.data;
  return body?.detail || body?.message || body?.title || 'Could not load the receipt.';
};

export default function ReceiptPage() {
  const { id } = useParams();
  const { data: receipt, isLoading, error } = useDeliveryReceipt(id);

  if (isLoading) {
    return <div className="farmer-page"><p className="farmer-muted">Loading receipt…</p></div>;
  }

  if (error || !receipt) {
    return (
      <div className="farmer-page">
        <div className="farmer-alert error">{problem(error)}</div>
        <Link to="/farmer/records" className="farmer-button ghost">Return to history</Link>
      </div>
    );
  }

  return (
    <div className="farmer-page">
      <header className="farmer-page-head">
        <div>
          <span className="farmer-eyebrow">Produce receipt</span>
          <h1>{receipt.receiptSerialNumber}</h1>
          <p>Issued delivery record from AgriSwift.</p>
        </div>
        <Link to="/farmer/records" className="farmer-button ghost">Back to history</Link>
      </header>

      <section className="farmer-panel">
        <div className="farmer-stats">
          <article className="farmer-stat-card">
            <span>Delivery date</span>
            <strong>{new Date(`${receipt.deliveryDate}T00:00:00`).toLocaleDateString('en-ZM')}</strong>
            <small>{receipt.depotName}</small>
          </article>
          <article className="farmer-stat-card">
            <span>Commodity</span>
            <strong>{receipt.cropName}</strong>
            <small>{Number(receipt.weightKg).toLocaleString('en-ZM')} kg</small>
          </article>
          <article className="farmer-stat-card">
            <span>Entitlement amount</span>
            <strong>{money.format(Number(receipt.amount))}</strong>
            <small>{receipt.validationStatus}</small>
          </article>
        </div>

        <div className="farmer-table-wrap" style={{ marginTop: 24 }}>
          <table className="farmer-table">
            <tbody>
              <tr><th>Receipt status</th><td>{receipt.receiptStatus}</td></tr>
              <tr><th>Validation</th><td>{receipt.validationStatus}</td></tr>
              <tr><th>Moisture result</th><td>{receipt.moistureCheckPassed ? 'Passed' : 'Not passed'}</td></tr>
              <tr><th>Board price used</th><td>{money.format(Number(receipt.pricePerKg))} per kg</td></tr>
              <tr><th>Issued</th><td>{new Date(receipt.issuedAt).toLocaleString('en-ZM')}</td></tr>
            </tbody>
          </table>
        </div>

        <p className="farmer-muted" style={{ marginTop: 20 }}>
          QR verification is not displayed in the farmer portal while the verification flow remains internal to AgriSwift.
        </p>
      </section>
    </div>
  );
}