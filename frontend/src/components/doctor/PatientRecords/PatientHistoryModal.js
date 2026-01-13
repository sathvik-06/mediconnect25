import React from 'react';
import './PatientHistoryModal.css';

const PatientHistoryModal = ({ patient, history, onClose, loading }) => {
    if (!patient) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content history-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Medical History: {patient.name}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="patient-summary">
                        <span><strong>Age/Gender:</strong> {patient.age ? `${patient.age} Yrs` : 'N/A'} / {patient.gender || '-'}</span>
                        <span><strong>Blood Group:</strong> {patient.bloodGroup || '-'}</span>
                    </div>

                    {loading ? (
                        <div className="loading-history">Loading history...</div>
                    ) : history.length === 0 ? (
                        <p className="no-history">No medical history found for this patient.</p>
                    ) : (
                        <div className="history-table-container">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Doctor</th>
                                        <th>Diagnosis</th>
                                        <th>Status</th>
                                        <th>Prescription</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((record) => (
                                        <tr key={record._id}>
                                            <td>{new Date(record.date).toLocaleDateString()} <br /> <small>{record.timeSlot}</small></td>
                                            <td>
                                                <div className="doctor-info">
                                                    <strong>{record.doctor?.name || 'Unknown Doctor'}</strong>
                                                    <small>{record.doctor?.specialization}</small>
                                                </div>
                                            </td>
                                            <td>{record.diagnosis || '-'}</td>
                                            <td>
                                                <span className={`status-badge ${record.status}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td>
                                                {record.prescription ? (
                                                    <span className="has-prescription">Available</span>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientHistoryModal;
