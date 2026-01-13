// src/components/patient/DoctorSearch/DoctorCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const {
    _id,
    name,
    specialization, // Changed from specialty
    experience,
    rating,
    hospital,
    consultationFee,
    availability, // Changed from availableToday (backend sends availability object)
    image
  } = doctor;

  // Calculate if available today based on backend data if needed, or use a helper
  // Backend query filtered by availability='today' if requested, but here we might want to show status.
  // For now, let's assume we want to show if they are available today.
  // The backend 'getAllDoctors' doesn't add 'availableToday' boolean unless we computed it.
  // Let's check if 'availability.workingDays' includes today.

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const isAvailableToday = availability?.workingDays?.includes(today);

  return (
    <div className="doctor-card">
      <div className="doctor-header">
        <div className="doctor-image">
          {image ? (
            <img src={image} alt={name} />
          ) : (
            <div className="doctor-avatar">👨‍⚕️</div>
          )}
        </div>

        <div className="doctor-info">
          <h3 className="doctor-name">Dr. {name}</h3>
          <p className="doctor-specialty">{specialization}</p>
          <div className="doctor-rating">
            <span className="rating-stars">⭐ {rating?.average || 0}</span>
            <span className="rating-count">({rating?.count || 0} reviews)</span>
          </div>
        </div>
      </div>

      <div className="doctor-details">
        <div className="detail-item">
          <span className="detail-label">Experience:</span>
          <span className="detail-value">{experience} years</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Hospital:</span>
          <span className="detail-value">{hospital?.name || 'N/A'}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Fee:</span>
          <span className="detail-value fee">₹{consultationFee}</span>
        </div>
      </div>

      <div className="doctor-availability">
        {isAvailableToday ? (
          <span className="availability available">Available Today</span>
        ) : (
          <span className="availability not-available">Not Available Today</span>
        )}
      </div>

      <div className="doctor-actions">
        <Link
          to={`/patient/book-appointment/${_id}`}
          className="btn btn-primary btn-full"
        >
          Book Appointment
        </Link>

        <Link to={`/patient/doctor-profile/${_id}`} className="btn btn-outline btn-full">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;