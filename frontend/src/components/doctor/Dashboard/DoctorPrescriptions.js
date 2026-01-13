import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../../services/api/prescriptions';
import PrescriptionCard from '../../patient/PrescriptionUpload/PrescriptionCard';
import './DoctorPrescriptions.css';

const DoctorPrescriptions = ({ onEdit }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        fetchPrescriptions();
    }, [filter]);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const data = await prescriptionService.getPrescriptions(filter);
            setPrescriptions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus, notes = '') => {
        try {
            await prescriptionService.validatePrescription(id, newStatus, notes);
            // Refresh list
            fetchPrescriptions();
            alert(`Prescription ${newStatus} successfully`);
        } catch (err) {
            alert(err.message || 'Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        try {
            await prescriptionService.deletePrescription(id);
            // Refresh list
            fetchPrescriptions();
            alert('Prescription deleted successfully');
        } catch (err) {
            alert(err.message || 'Failed to delete prescription');
        }
    };

    return (
        <div className="doctor-prescriptions-card">
            <div className="card-header">
                <h3>Prescription Approvals</h3>
                <div className="filter-controls">
                    <button
                        className={filter === 'pending' ? 'active' : ''}
                        onClick={() => setFilter('pending')}
                    >Pending</button>
                    <button
                        className={filter === 'approved' ? 'active' : ''}
                        onClick={() => setFilter('approved')}
                    >Approved</button>
                    <button
                        className={filter === 'rejected' ? 'active' : ''}
                        onClick={() => setFilter('rejected')}
                    >Rejected</button>
                </div>
            </div>

            <div className="prescriptions-content">
                {loading ? (
                    <div className="loading">Loading prescriptions...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : prescriptions.length === 0 ? (
                    <div className="empty-state">No {filter} prescriptions found</div>
                ) : (
                    <div className="prescriptions-grid">
                        {prescriptions.map(prescription => (
                            <div key={prescription._id} className="approval-card-wrapper">
                                <PrescriptionCard
                                    prescription={prescription}
                                    showOrderButton={false}
                                    onDelete={handleDelete}
                                />
                                {filter === 'pending' && (
                                    <div className="approval-actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => onEdit && onEdit(prescription)}
                                        >Edit</button>
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleStatusUpdate(prescription._id, 'approved', 'Approved by doctor')}
                                        >Approve</button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => {
                                                const reason = prompt('Reason for rejection:');
                                                if (reason) handleStatusUpdate(prescription._id, 'rejected', reason);
                                            }}
                                        >Reject</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPrescriptions;
