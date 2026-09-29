export default function Records() {
    return (
        <div className="card">
            <h2 className="title-md mb-md">Delivery Records</h2>
            <div className="state-msg">
                <span className="material-symbols-outlined" style={{ fontSize: '32px', marginBottom: '16px' }}>inventory_2</span>
                <p>No historical records found for this season.</p>
            </div>
        </div>
    );
}