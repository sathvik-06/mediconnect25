import React, { useState, useEffect } from 'react';
import api from '../../../services/api/config';
import './DoctorPatients.css';

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/doctors/patients');
            if (response.success) {
                setPatients(response.patients);
            }
        } catch (err) {
            setError('Failed to load patients');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewHistory = async (patient) => {
        setSelectedPatient(patient);
        setHistoryLoading(true);
        try {
            const response = await api.get(`/doctors/patients/${patient._id}/history`);
            if (response.success) {
                setPatientHistory(response.appointments);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const closeHistory = () => {
        setSelectedPatient(null);
        setPatientHistory([]);
    };

    const getStatusBadge = (status) => {
        const colors = {
            'completed': '#28a745',
            'in-progress': '#007bff',
            'checked-in': '#17a2b8',
            'confirmed': '#ffc107',
            'cancelled': '#dc3545'
        };
        return <span style={{
            backgroundColor: colors[status] || '#6c757d',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.85em',
            textTransform: 'capitalize'
        }}>{status}</span>;
    };

    if (loading) return <div className="loading">Loading patients...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="doctor-patients">
            <h3>My Patients</h3>
            {patients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <div className="patients-grid">
                    {patients.map(patient => (
                        <div key={patient._id} className="patient-card">
                            <div className="patient-info">
                                <h4>{patient.name}</h4>
                                <p><strong>Email:</strong> {patient.email}</p>
                                <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
                                <p><strong>Blood Group:</strong> {patient.bloodGroup || 'N/A'}</p>
                                <p><strong>Total Visits:</strong> {patient.totalVisits}</p>
                                <p><strong>Last Visit:</strong> {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <button
                                className="btn-view-history"
                                onClick={() => handleViewHistory(patient)}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                View History
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedPatient && (
                <div className="modal-overlay" onClick={closeHistory}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>History: {selectedPatient.name}</h3>
                            <button className="close-btn" onClick={closeHistory}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {historyLoading ? (
                                <div className="loader">Loading history...</div>
                            ) : patientHistory.length > 0 ? (
                                <div className="history-list">
                                    {patientHistory.map(apt => (
                                        <div key={apt._id} className="history-item" style={{
                                            borderBottom: '1px solid #eee',
                                            padding: '10px 0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div className="history-info">
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {new Date(apt.date).toLocaleDateString()}
                                                </div>
                                                <div style={{ fontSize: '0.9em', color: '#666' }}>
                                                    {apt.timeSlot}
                                                </div>
                                                {apt.diagnosis && (
                                                    <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
                                                        Diagnosis: {apt.diagnosis}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="history-status">
                                                {getStatusBadge(apt.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No history found for this patient.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;
