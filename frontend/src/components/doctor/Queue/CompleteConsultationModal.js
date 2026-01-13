// src/components/doctor/Queue/CompleteConsultationModal.js
import React, { useState } from 'react';
import { appointmentService } from '../../../services/api/appointments';
import './CompleteConsultationModal.css';

const CompleteConsultationModal = ({ appointment, onClose, onComplete }) => {
    const [formData, setFormData] = useState({
        diagnosis: '',
        notes: '',
        followUpRequired: false,
        followUpDate: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.diagnosis.trim()) {
            alert('Please enter a diagnosis');
            return;
        }

        try {
            setSubmitting(true);
            await appointmentService.completeConsultation(appointment._id, formData);
            alert('Consultation completed successfully! Patient has been notified.');
            onComplete();
        } catch (error) {
            console.error('Error completing consultation:', error);
            alert(error.message || 'Failed to complete consultation');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Complete Consultation</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="patient-summary">
                    <h3>{appointment.patient.name}</h3>
                    <p><strong>Time Slot:</strong> {appointment.timeSlot}</p>
                    {appointment.symptoms && (
                        <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="consultation-form">
                    <div className="form-group">
                        <label htmlFor="diagnosis">
                            Diagnosis <span className="required">*</span>
                        </label>
                        <textarea
                            id="diagnosis"
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            placeholder="Enter diagnosis..."
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Consultation Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Additional notes, observations, treatment plan..."
                            rows="5"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="followUpRequired"
                                checked={formData.followUpRequired}
                                onChange={handleChange}
                            />
                            <span>Follow-up Required</span>
                        </label>
                    </div>

                    {formData.followUpRequired && (
                        <div className="form-group">
                            <label htmlFor="followUpDate">Follow-up Date</label>
                            <input
                                type="date"
                                id="followUpDate"
                                name="followUpDate"
                                value={formData.followUpDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Completing...' : 'Complete Consultation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteConsultationModal;
