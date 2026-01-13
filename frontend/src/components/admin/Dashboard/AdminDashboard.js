import React, { useState, useEffect } from 'react';
import api from '../../../services/api/config';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get('/analytics/dashboard');
                setStats(data.stats);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (!stats) return <div>Error loading dashboard</div>;

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Patients</h3>
                    <p>{stats.totalPatients}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Doctors</h3>
                    <p>{stats.totalDoctors}</p>
                </div>
                <div className="stat-card">
                    <h3>Appointments</h3>
                    <p>{stats.totalAppointments}</p>
                </div>
                <div className="stat-card">
                    <h3>Revenue</h3>
                    <p>${stats.totalRevenue}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
