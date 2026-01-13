// src/components/patient/Dashboard/UpcomingAppointments.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../../services/api/appointments';
import './UpcomingAppointments.css';

const UpcomingAppointments = ({ appointments, onAppointmentUpdate }) => {
  const [cancellingId, setCancellingId] = useState(null);
  const [checkingInId, setCheckingInId] = useState(null);

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) > new Date() && ['scheduled', 'confirmed', 'checked-in'].includes(apt.status))
    .slice(0, 5);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if appointment can be cancelled (3-hour rule)
  const canCancelAppointment = (appointment) => {
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

      return timeDifferenceHours >= 3;
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

  const handleCheckIn = async (appointmentId) => {
    try {
      setCheckingInId(appointmentId);
      await appointmentService.checkInAppointment(appointmentId);
      alert('Checked in successfully! The doctor has been notified.');

      // Refresh appointments list
      if (onAppointmentUpdate) {
        onAppointmentUpdate();
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert(error.message || 'Failed to check in. Please try again.');
    } finally {
      setCheckingInId(null);
    }
  };

  // Check if appointment is today
  const isToday = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(dateString);
    appointmentDate.setHours(0, 0, 0, 0);
    return today.getTime() === appointmentDate.getTime();
  };

  if (upcomingAppointments.length === 0) {
    return (
      <div className="upcoming-appointments">
        <div className="section-header">
          <h3>Upcoming Appointments</h3>
          <Link to="/patient/doctors" className="btn btn-primary btn-small">
            Book Appointment
          </Link>
        </div>
        <div className="empty-state">
          <p>No upcoming appointments</p>
          <Link to="/patient/doctors" className="btn btn-secondary">
            Find Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-appointments">
      <div className="section-header">
        <h3>Upcoming Appointments</h3>
        <Link to="/patient/doctors" className="btn btn-primary btn-small">
          Book New
        </Link>
      </div>

      <div className="appointments-list">
        {upcomingAppointments.map((appointment) => {
          const canCancel = canCancelAppointment(appointment);
          const isCancelling = cancellingId === appointment._id;

          return (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-info">
                <h4>Dr. {appointment.doctor.name}</h4>
                <p className="specialty">{appointment.doctor.specialization}</p>

                <div className="appointment-times">
                  <div className="time-info">
                    <strong>Booked on:</strong>
                    <p className="booked-time">
                      {new Date(appointment.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="time-info">
                    <strong>Appointment on:</strong>
                    <p className="date">{formatDate(appointment.date)}</p>
                    <p className="time-slot">{appointment.timeSlot}</p>
                  </div>
                </div>

                <span className={`status ${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-actions">
                {appointment.status === 'confirmed' && isToday(appointment.date) && (
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleCheckIn(appointment._id)}
                    disabled={checkingInId === appointment._id}
                    style={{ marginRight: '10px' }}
                  >
                    {checkingInId === appointment._id ? 'Checking In...' : 'Check In'}
                  </button>
                )}
                {appointment.status === 'checked-in' && (
                  <span className="status checked-in" style={{ marginRight: '10px' }}>
                    ✓ Checked In
                  </span>
                )}
                <button
                  className="btn btn-outline btn-small"
                  onClick={() => handleCancelAppointment(appointment._id)}
                  disabled={!canCancel || isCancelling}
                  title={!canCancel ? 'Cannot cancel within 3 hours of appointment' : 'Cancel appointment'}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel'}
                </button>
                {!canCancel && (
                  <small className="cancel-warning">
                    Cannot cancel within 3 hours
                  </small>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingAppointments;