import React from 'react';

const PharmacyDashboard = () => {
    return (
        <div className="pharmacy-dashboard">
            <h2>Pharmacy Dashboard</h2>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Pending Orders</h3>
                    <p>12</p>
                </div>
                <div className="stat-card">
                    <h3>Low Stock Items</h3>
                    <p>5</p>
                </div>
                <div className="stat-card">
                    <h3>Today's Sales</h3>
                    <p>₹1,500</p>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
