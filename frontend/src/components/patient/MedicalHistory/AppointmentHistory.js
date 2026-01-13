// src/components/patient/MedicalHistory/AppointmentHistory.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../../services/api/appointments';
import './AppointmentHistory.css';

const AppointmentHistory = ({ history, onAppointmentUpdate }) => {
  const navigate = useNavigate();
  const [cancellingId, setCancellingId] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#059669';
      case 'cancelled':
        return '#dc2626';
      case 'scheduled':
        return '#2563eb';
      case 'confirmed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  // Check if appointment can be cancelled (3-hour rule)
  const canCancelAppointment = (appointment) => {
    // Allow cancellation for scheduled or confirmed appointments only
    if (!['scheduled', 'confirmed'].includes(appointment.status)) return false;

    try {
      const appointmentDate = new Date(appointment.date);

      // Parse time slot - handle both "HH:MM - HH:MM" and "HH:MM AM/PM" formats
      let timeStr = appointment.timeSlot;
      if (timeStr.includes(' - ')) {
        timeStr = timeStr.split(' - ')[0]; // Get start time
      }

      // Handle AM/PM format
      if (timeStr.includes('AM') || timeStr.includes('PM')) {
        const isPM = timeStr.includes('PM');
        const cleanTime = timeStr.replace(/AM|PM/g, '').trim();
        let [hours, minutes] = cleanTime.split(':').map(Number);

        // Convert to 24-hour format
        if (isPM && hours !== 12) {
          hours += 12;
        } else if (!isPM && hours === 12) {
          hours = 0;
        }

        appointmentDate.setHours(hours, minutes, 0, 0);
      } else {
        // 24-hour format
        const [hours, minutes] = timeStr.split(':').map(Number);
        appointmentDate.setHours(hours, minutes, 0, 0);
      }

      const now = new Date();
      const timeDifferenceMs = appointmentDate - now;
      const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

      return timeDifferenceHours >= 3 && appointmentDate > now;
    } catch (error) {
      console.error('Error checking cancellation eligibility:', error);
      return false;
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment? The doctor will be notified.'
    );

    if (!confirmed) return;

    try {
      setCancellingId(appointmentId);
      await appointmentService.cancelAppointment(appointmentId);
      alert('Appointment cancelled successfully. The doctor has been notified.');

      // Refresh appointments list
      if (onAppointmentUpdate) {
        onAppointmentUpdate();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert(error.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (history.length === 0) {
    return (
      <div className="empty-history">
        <div className="empty-icon">📅</div>
        <h3>No Appointment History</h3>
        <p>Your appointment history will appear here once you book consultations.</p>
      </div>
    );
  }

  return (
    <div className="appointment-history">
      <h3>Appointment History</h3>

      <div className="history-list">
        {history.map((appointment) => {
          const canCancel = canCancelAppointment(appointment);
          const isCancelling = cancellingId === appointment._id;

          return (
            <div key={appointment._id} className="history-item">
              <div className="history-main">
                <div className="doctor-info">
                  <h4>Dr. {appointment.doctor.name}</h4>
                  <p className="specialty">{appointment.doctor.specialization}</p>
                  <p className="date">{formatDate(appointment.date)}</p>
                  {appointment.timeSlot && (
                    <p className="time-slot">{appointment.timeSlot}</p>
                  )}
                </div>

                <div className="appointment-details">
                  <span
                    className="status"
                    style={{ backgroundColor: getStatusColor(appointment.status) + '20', color: getStatusColor(appointment.status) }}
                  >
                    {appointment.status}
                  </span>
                  <p className="diagnosis">
                    {appointment.diagnosis || 'No diagnosis recorded'}
                  </p>
                </div>
              </div>

              {appointment.notes && (
                <div className="appointment-notes">
                  <strong>Notes:</strong> {appointment.notes}
                </div>
              )}

              <div className="appointment-actions">
                {appointment.type === 'video' && appointment.status === 'confirmed' && (
                  <button
                    className="btn-join-video"
                    onClick={() => navigate(`/patient/video/${appointment._id}`)}
                  >
                    📹 Join Video Consultation
                  </button>
                )}

                {canCancel && (
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancelAppointment(appointment._id)}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AppointmentHistory;