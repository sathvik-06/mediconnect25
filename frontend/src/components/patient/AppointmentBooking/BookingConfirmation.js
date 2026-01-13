// src/components/patient/AppointmentBooking/BookingConfirmation.js
import React from 'react';
import './BookingConfirmation.css';

const BookingConfirmation = ({ bookingData, doctor, onBackToDashboard, onBookAnother }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString; // Assuming time is already in readable format
  };

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✅</div>
        <h2>Appointment Booked Successfully!</h2>
        <p>Your appointment has been confirmed. You will receive a confirmation email shortly.</p>
      </div>

      <div className="confirmation-details">
        <div className="detail-card">
          <h3>Appointment Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Appointment ID:</span>
              <span className="detail-value">{bookingData._id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Doctor:</span>
              <span className="detail-value">Dr. {doctor.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Specialty:</span>
              <span className="detail-value">{doctor.specialization}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(bookingData.date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{formatTime(bookingData.timeSlot)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Consultation Fee:</span>
              <span className="detail-value fee">₹{doctor.consultationFee}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status confirmed">Confirmed</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h3>Doctor Information</h3>
          <div className="doctor-info">
            <div className="doctor-avatar">👨‍⚕️</div>
            <div className="doctor-details">
              <h4>Dr. {doctor.name}</h4>
              <p className="specialty">{doctor.specialization}</p>
              {doctor.hospital?.name && <p className="hospital">{doctor.hospital.name}</p>}
              <p className="experience">{doctor.experience} years experience</p>
              <div className="rating">
                ⭐ {doctor.rating?.average || 0} ({doctor.rating?.count || 0} reviews)
              </div>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h3>What's Next?</h3>
          <div className="next-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Confirmation Email</strong>
                <p>You'll receive an email with all appointment details</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Reminder</strong>
                <p>We'll send you a reminder 24 hours before your appointment</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Join Appointment</strong>
                <p>Use the link in your email to join the video consultation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button className="btn btn-secondary" onClick={onBackToDashboard}>
          Back to Dashboard
        </button>
        <button className="btn btn-primary" onClick={onBookAnother}>
          Book Another Appointment
        </button>
      </div>

      <div className="confirmation-footer">
        <p>
          Need to make changes? <button className="link-button">Contact Support</button>
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;