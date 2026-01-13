// src/components/doctor/Queue/DoctorQueue.js
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../../services/api/appointments';
import { socketService } from '../../../services/websocket/socketService';
import CompleteConsultationModal from './CompleteConsultationModal';
import './DoctorQueue.css';

const DoctorQueue = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchAppointments();

        const handleAppointmentUpdate = () => {
            fetchAppointments();
        };

        socketService.on('appointmentUpdated', handleAppointmentUpdate);

        return () => {
            socketService.off('appointmentUpdated', handleAppointmentUpdate);
        };
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getDoctorAppointments();

            // Filter for today's checked-in and in-progress appointments
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayAppointments = response.appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                const todayDate = new Date();
                return aptDate.toDateString() === todayDate.toDateString() &&
                    ['confirmed', 'in-progress'].includes(apt.status);
            });

            // Sort by time slot or creation date
            todayAppointments.sort((a, b) =>
                a.timeSlot.localeCompare(b.timeSlot)
            );

            setAppointments(todayAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartConsultation = async (appointmentId) => {
        try {
            setActionLoading(appointmentId);
            await appointmentService.startConsultation(appointmentId);
            await fetchAppointments();
        } catch (error) {
            console.error('Error starting consultation:', error);
            alert(error.message || 'Failed to start consultation');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCompleteConsultation = (appointment) => {
        setSelectedAppointment(appointment);
        setShowCompleteModal(true);
    };

    const handleMarkNoShow = async (appointmentId) => {
        if (!window.confirm('Mark this patient as no-show?')) return;

        try {
            setActionLoading(appointmentId);
            await appointmentService.markNoShow(appointmentId);
            await fetchAppointments();
        } catch (error) {
            console.error('Error marking no-show:', error);
            alert(error.message || 'Failed to mark as no-show');
        } finally {
            setActionLoading(null);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ${diffMins % 60}m ago`;
    };

    if (loading) {
        return (
            <div className="doctor-queue">
                <h2>Today's Queue</h2>
                <div className="loading">Loading queue...</div>
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <div className="doctor-queue">
                <h2>Today's Queue</h2>
                <div className="empty-queue">
                    <div className="empty-icon">👥</div>
                    <h3>No Patients Waiting</h3>
                    <p>Waiting patients will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-queue">
            <div className="queue-header">
                <h2>Today's Queue</h2>
                <span className="queue-count">{appointments.length} patient{appointments.length !== 1 ? 's' : ''} waiting</span>
            </div>

            <div className="queue-list">
                {appointments.map((appointment, index) => (
                    <div key={appointment._id} className={`queue-item ${appointment.status}`}>
                        <div className="queue-position">#{index + 1}</div>

                        <div className="patient-info">
                            <h3>{appointment.patient.name}</h3>
                            <p className="patient-contact">{appointment.patient.email}</p>
                            <p className="patient-phone">{appointment.patient.phone}</p>
                            {appointment.symptoms && (
                                <p className="symptoms"><strong>Symptoms:</strong> {appointment.symptoms}</p>
                            )}
                        </div>

                        <div className="appointment-details">
                            <div className="detail-item">
                                <span className="label">Scheduled Time:</span>
                                <span className="value">{appointment.timeSlot}</span>
                            </div>

                            {appointment.status === 'in-progress' && appointment.consultationStartedAt && (
                                <div className="detail-item">
                                    <span className="label">Started:</span>
                                    <span className="value">{formatTime(appointment.consultationStartedAt)}</span>
                                </div>
                            )}
                        </div>

                        <div className="queue-actions">
                            {appointment.status === 'confirmed' && (
                                <>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleStartConsultation(appointment._id)}
                                        disabled={actionLoading === appointment._id}
                                    >
                                        {actionLoading === appointment._id ? 'Starting...' : 'Start Consultation'}
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => handleMarkNoShow(appointment._id)}
                                        disabled={actionLoading === appointment._id}
                                    >
                                        No Show
                                    </button>
                                </>
                            )}

                            {appointment.status === 'in-progress' && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleCompleteConsultation(appointment)}
                                >
                                    Complete Consultation
                                </button>
                            )}
                        </div>

                        <span className={`status-badge ${appointment.status}`}>
                            {appointment.status === 'confirmed' ? 'Waiting' : 'In Progress'}
                        </span>
                    </div>
                ))}
            </div>

            {showCompleteModal && (
                <CompleteConsultationModal
                    appointment={selectedAppointment}
                    onClose={() => {
                        setShowCompleteModal(false);
                        setSelectedAppointment(null);
                    }}
                    onComplete={() => {
                        setShowCompleteModal(false);
                        setSelectedAppointment(null);
                        fetchAppointments();
                    }}
                />
            )}
        </div>
    );
};

export default DoctorQueue;
