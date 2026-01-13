import React, { useState, useEffect } from 'react';
import DoctorAppointments from './DoctorAppointments';
import DoctorPrescriptions from './DoctorPrescriptions';
import DoctorPatients from './DoctorPatients'; // New component
import DoctorAddPrescription from './DoctorAddPrescription';
import DoctorQueue from '../Queue/DoctorQueue';
import { doctorsService } from '../../../services/api/doctors';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
    // 'dashboard' (default), 'appointments', 'patients', 'reports' (prescriptions), 'queue'
    const [activeView, setActiveView] = useState('dashboard');
    const [editingPrescription, setEditingPrescription] = useState(null);
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        pendingReports: 0
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const data = await doctorsService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    // Helper to render the correct component based on active view
    const renderContent = () => {
        switch (activeView) {
            case 'queue':
                return <DoctorQueue />;
            case 'appointments':
                return <DoctorAppointments />;
            case 'patients':
                return <DoctorPatients />;
            case 'reports':
                // Assuming 'Pending Reports' refers to Prescriptions for now
                // Or we can create a specific component if "Reports" meant Lab Reports.
                // Given the context, we show Prescriptions here.
                return <DoctorPrescriptions />;
            case 'dashboard':
            default:
                return (
                    <div className="dashboard-container">
                        <div className="dashboard-full-row">
                            <DoctorAddPrescription
                                editingPrescription={editingPrescription}
                                onCancelEdit={() => setEditingPrescription(null)}
                                onPrescriptionAdded={() => {
                                    setEditingPrescription(null);
                                    fetchDashboardStats(); // Refresh stats after adding a prescription
                                }}
                            />
                        </div>
                        <div className="dashboard-grid">
                            <div className="dashboard-left-col">
                                <DoctorPrescriptions
                                    onEdit={(prescription) => setEditingPrescription(prescription)}
                                />
                            </div>
                            <div className="dashboard-right-col">
                                <DoctorAppointments />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="doctor-dashboard">
            <h2>Doctor Dashboard</h2>

            <div className="dashboard-stats">
                <div
                    className={`stat-card ${activeView === 'queue' ? 'active' : ''}`}
                    onClick={() => setActiveView('queue')}
                    style={{ cursor: 'pointer' }}
                >
                    <h3>Patient Queue</h3>
                    <p>👥</p>
                </div>
                <div
                    className={`stat-card ${activeView === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveView('appointments')}
                    style={{ cursor: 'pointer' }}
                >
                    <h3>Today's Appointments</h3>
                    <p>{stats.todayAppointments}</p>
                </div>
                <div
                    className={`stat-card ${activeView === 'patients' ? 'active' : ''}`}
                    onClick={() => setActiveView('patients')}
                    style={{ cursor: 'pointer' }}
                >
                    <h3>Total Patients</h3>
                    <p>{stats.totalPatients}</p>
                </div>
                <div
                    className={`stat-card ${activeView === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveView('reports')}
                    style={{ cursor: 'pointer' }}
                >
                    <h3>Pending Reports</h3>
                    <p>{stats.pendingReports}</p>
                </div>
                {activeView !== 'dashboard' && (
                    <div
                        className="stat-card"
                        onClick={() => setActiveView('dashboard')}
                        style={{ cursor: 'pointer', background: '#f3f4f6' }}
                    >
                        <h3>Back to Dashboard</h3>
                        <p>↩</p>
                    </div>
                )}
            </div>

            <div className="dashboard-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default DoctorDashboard;
