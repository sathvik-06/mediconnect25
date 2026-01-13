// src/components/patient/AppointmentBooking/BookingForm.js
import React, { useState } from 'react';
import VoiceAssistant from '../VoiceAssisstant/VoiceAssistant';
import './BookingForm.css';

const BookingForm = ({
  doctor,
  selectedDate,
  selectedSlot,
  onSubmit,
  onBack,
  onVoiceBooking
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    contactNumber: '',
    symptoms: '',
    previousConditions: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData.patientAge || formData.patientAge < 1 || formData.patientAge > 120) {
      newErrors.patientAge = 'Please enter a valid age';
    }

    if (!formData.patientGender) {
      newErrors.patientGender = 'Please select gender';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatAppointmentTime = () => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' at ' + selectedSlot.time;
  };

  return (
    <div className="booking-form">
      <div className="form-header">
        <h3>Patient Details</h3>
        <p>Please provide the patient information for the appointment</p>
      </div>

      <div className="appointment-summary">
        <h4>Appointment Summary</h4>
        <p>
          <strong>Doctor:</strong> Dr. {doctor.name} ({doctor.specialty})<br />
          <strong>Date & Time:</strong> {formatAppointmentTime()}<br />
          <strong>Fee:</strong> ₹{doctor.consultationFee}
        </p>
      </div>

      <VoiceAssistant onVoiceCommand={onVoiceBooking} />

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="patientName" className="form-label">
              Patient Name *
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              className={`form-input ${errors.patientName ? 'error' : ''}`}
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter patient's full name"
            />
            {errors.patientName && (
              <span className="error-text">{errors.patientName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="patientAge" className="form-label">
              Age *
            </label>
            <input
              type="number"
              id="patientAge"
              name="patientAge"
              className={`form-input ${errors.patientAge ? 'error' : ''}`}
              value={formData.patientAge}
              onChange={handleChange}
              placeholder="Age in years"
              min="1"
              max="120"
            />
            {errors.patientAge && (
              <span className="error-text">{errors.patientAge}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="patientGender" className="form-label">
              Gender *
            </label>
            <select
              id="patientGender"
              name="patientGender"
              className={`form-input ${errors.patientGender ? 'error' : ''}`}
              value={formData.patientGender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.patientGender && (
              <span className="error-text">{errors.patientGender}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber" className="form-label">
              Contact Number *
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              className={`form-input ${errors.contactNumber ? 'error' : ''}`}
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="10-digit phone number"
              pattern="[0-9]{10}"
            />
            {errors.contactNumber && (
              <span className="error-text">{errors.contactNumber}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="symptoms" className="form-label">
            Symptoms (Optional)
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            className="form-input"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe any symptoms or health concerns"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="previousConditions" className="form-label">
            Previous Medical Conditions (Optional)
          </label>
          <textarea
            id="previousConditions"
            name="previousConditions"
            className="form-input"
            value={formData.previousConditions}
            onChange={handleChange}
            placeholder="Any existing medical conditions or allergies"
            rows="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            className="form-input"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information for the doctor"
            rows="2"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back to Time Selection
          </button>
          <button type="submit" className="btn btn-primary">
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;