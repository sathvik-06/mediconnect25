import React, { useState, useEffect } from 'react';
import api from '../../../services/api/config';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await api.get('/analytics/dashboard');
                setStats(data.stats);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load analytics');
                setLoading(false);
                console.error(err);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading analytics...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!stats) return null;

    const displayStats = [
        { label: 'Total Patients', value: stats.totalPatients },
        { label: 'Total Doctors', value: stats.totalDoctors },
        { label: 'Total Appointments', value: stats.totalAppointments },
        { label: 'Medicine Revenue', value: `₹${stats.medicineRevenue?.toFixed(2) || '0.00'}` },
        { label: 'Appointment Revenue', value: `₹${stats.appointmentRevenue?.toFixed(2) || '0.00'}` },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toFixed(2) || '0.00'}` },
        { label: 'Pending Prescriptions', value: stats.pendingPrescriptions }
    ];

    return (
        <div className="analytics">
            <h2>System Analytics</h2>

            <div className="stats-grid">
                {displayStats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <h3>{stat.label}</h3>
                        <div className="stat-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="charts-container">
                <div className="chart-box">
                    <h3>Recent Appointments</h3>
                    <table className="recent-appointments-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentAppointments && stats.recentAppointments.map(apt => (
                                <tr key={apt._id}>
                                    <td>{apt.patient?.name || 'Unknown'}</td>
                                    <td>{apt.doctor?.name || 'Unknown'}</td>
                                    <td>{new Date(apt.createdAt).toLocaleDateString()}</td>
                                    <td>{apt.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
