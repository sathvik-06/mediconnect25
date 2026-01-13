import React, { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import './PatientRecords.css';
import PatientHistoryModal from './PatientHistoryModal';

const PatientRecords = () => {
    const { get, loading, error } = useApi();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);

    const handleViewHistory = async (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
        setHistoryLoading(true);
        try {
            const response = await get(`/doctors/patients/${patient._id}/history`);
            if (response.success) {
                setHistory(response.appointments);
            }
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPatient(null);
        setHistory([]);
    };

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await get('/doctors/patients');
            if (response.success) {
                setPatients(response.data.patients);
            }
        };
        fetchPatients();
    }, [get]);

    if (loading) return <div className="loading">Loading patients...</div>;

    return (
        <div className="patient-records">
            <h2>Patient Records</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="records-content">
                {patients.length === 0 ? (
                    <p className="no-data">List of patients and their medical history will be displayed here once appointments are booked.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="patients-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Age/Gender</th>
                                    <th>Contact</th>
                                    <th>Blood Group</th>
                                    <th>Last Visit</th>
                                    <th>Total Visits</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(patient => (
                                    <tr key={patient._id}>
                                        <td>
                                            <div className="patient-info">
                                                {patient.name}
                                            </div>
                                        </td>
                                        <td>
                                            {patient.dob ? `${new Date().getFullYear() - new Date(patient.dob).getFullYear()} Yrs` : 'N/A'} / {patient.gender || '-'}
                                        </td>
                                        <td>
                                            <div className="contact-info">
                                                <span>{patient.phone}</span>
                                                <span className="email">{patient.email}</span>
                                            </div>
                                        </td>
                                        <td>{patient.bloodGroup || '-'}</td>
                                        <td>{patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : '-'}</td>
                                        <td>{patient.totalVisits}</td>
                                        <td>
                                            <button
                                                className="view-history-btn"
                                                onClick={() => handleViewHistory(patient)}
                                            >
                                                View History
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showModal && (
                <PatientHistoryModal
                    patient={selectedPatient}
                    history={history}
                    onClose={handleCloseModal}
                    loading={historyLoading}
                />
            )}
        </div>
    );
};

export default PatientRecords;
