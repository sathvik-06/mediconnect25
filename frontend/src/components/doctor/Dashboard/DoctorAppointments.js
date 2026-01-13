import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../../services/api/appointments';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { socketService } from '../../../services/websocket/socketService';
import './DoctorAppointments.css';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();

        const handleAppointmentUpdate = (updatedAppointment) => {
            setAppointments(prev => {
                // If appointment exists, update it
                const exists = prev.find(a => a._id === updatedAppointment._id);
                if (exists) {
                    // removing if checked-in? No, DoctorAppointments usually shows all today's requests?
                    // Actually, if status changes to checked-in, it might stay here or move to queue?
                    // Let's just update the status for now.
                    return prev.map(a => a._id === updatedAppointment._id ? updatedAppointment : a);
                }
                return prev;
            });
        };

        socketService.on('appointmentUpdated', handleAppointmentUpdate);

        return () => {
            socketService.off('appointmentUpdated', handleAppointmentUpdate);
        };
    }, []);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentService.getDoctorAppointments();
            setAppointments(data.appointments || []);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, status) => {
        try {
            await appointmentService.updateAppointmentStatus(appointmentId, status);
            // Optimistic update
            setAppointments(appointments.map(apt =>
                apt._id === appointmentId ? { ...apt, status } : apt
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    // Check-In function removed


    if (loading) return <LoadingSpinner />;

    return (
        <div className="doctor-appointments-card">
            <div className="card-header">
                <h3>Today's Appointment Requests</h3>
            </div>

            <div className="appointments-content">
                {error && <div className="error-message">{error}</div>}

                <div className="appointments-list">
                    {appointments.length > 0 ? (
                        appointments.map((apt) => (
                            <div key={apt._id} className="appointment-card">
                                <div className="appointment-info">
                                    <h4>{apt.patient?.name || 'Unknown Patient'}</h4>
                                    <div className="appointment-meta">
                                        <span className="time-slot">🕒 {apt.timeSlot}</span>
                                        <span className="date-slot">📅 {new Date(apt.date).toLocaleDateString()}</span>
                                        <div className="symptoms">Symptoms: {apt.symptoms}</div>
                                    </div>
                                </div>

                                <div className="appointment-actions">
                                    {apt.status === 'scheduled' || apt.status === 'pending' ? (
                                        <>
                                            <button
                                                className="btn-accept"
                                                onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <div className="status-actions">
                                            <span className={`status-badge ${apt.status}`}>
                                                {apt.status}
                                            </span>
                                            {(apt.status === 'confirmed' || apt.status === 'in-progress') && (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    {apt.status === 'confirmed' && (
                                                        <>
                                                            <button
                                                                className="btn-start"
                                                                onClick={() => handleStatusUpdate(apt._id, 'in-progress')}
                                                                style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                            >
                                                                Start
                                                            </button>
                                                            <button
                                                                className="btn-complete"
                                                                onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                                style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                            >
                                                                Complete
                                                            </button>
                                                        </>
                                                    )}
                                                    {apt.status === 'in-progress' && (
                                                        <button
                                                            className="btn-complete"
                                                            onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                            style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-appointments">
                            <p>No appointments pending action</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;
