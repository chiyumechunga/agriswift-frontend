// src/api/farmer.js
export const getFarmerDashboard = async (farmerId) => {
    // API logic or mock data return
    return {
        entitlement: { currency: 'ZMW', amount: 15000 },
        recentDelivery: { depot: 'Central Depot', ref: 'DEL-1092', moisture: 12.5, quantity: 4.5, grade: 'Grade A' },
        payoutSteps: [
            { id: 1, label: 'Delivery Verified', date: 'Sep 20', location: 'Central Depot', status: 'completed' },
            { id: 2, label: 'Payout Processing', date: 'Sep 21', status: 'pending' }
        ]
    };
};