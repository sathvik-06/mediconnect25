// src/components/patient/AppointmentBooking/AppointmentBooking.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorsService } from '../../../services/api/doctors';
import { appointmentService } from '../../../services/api/appointments';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookingData, setBookingData] = useState({});

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    console.log('AppointmentBooking: Fetching details for ID:', doctorId);
    try {
      const doctorData = await doctorsService.getDoctorById(doctorId);
      console.log('AppointmentBooking: Data received:', doctorData);
      setDoctor(doctorData);

      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);

    } catch (error) {
      console.error('Error fetching doctor details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && doctorId) {
      fetchAvailability();
    }
  }, [selectedDate, doctorId]);

  const fetchAvailability = async () => {
    try {
      const availabilityData = await doctorsService.getDoctorAvailability(doctorId, selectedDate);
      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const bookingPayload = {
        doctorId: doctorId,
        date: selectedDate,
        timeSlot: selectedSlot.time,
        type: 'in-person', // Default type
        symptoms: formData.symptoms,
        consultationFee: doctor.consultationFee,
        notes: formData.notes || ''
      };

      const result = await appointmentService.bookAppointment(bookingPayload);
      setBookingData(result.appointment);
      setStep(3); // Move to confirmation step
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleVoiceBooking = (bookingInfo) => {
    // Auto-fill form based on voice command
    if (bookingInfo.date) {
      setSelectedDate(bookingInfo.date);
    }
    if (bookingInfo.time) {
      // Find matching time slot
      const slot = availability.find(s => s.time === bookingInfo.time);
      if (slot) {
        setSelectedSlot(slot);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!doctor && doctorId) {
    return (
      <div className="error-state">
        <h3>Doctor not found</h3>
        <p>Please try selecting a different doctor.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/patient/doctors')}
        >
          Find Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-booking">
      <div className="booking-header">
        <h1>Book Appointment</h1>
        {doctor && (
          <div className="doctor-preview">
            <div className="doctor-avatar">👨‍⚕️</div>
            <div className="doctor-info">
              <h3>Dr. {doctor.name}</h3>
              <p>{doctor.specialization} • {doctor.hospital?.name || 'Hospital'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="booking-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Select Time</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Patient Details</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="booking-content">
        {step === 1 && (
          <TimeSlotPicker
            doctor={doctor}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            availability={availability}
            onDateSelect={handleDateSelect}
            onSlotSelect={handleSlotSelect}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <BookingForm
            doctor={doctor}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSubmit={handleBookingSubmit}
            onBack={() => setStep(1)}
            onVoiceBooking={handleVoiceBooking}
          />
        )}

        {step === 3 && (
          <BookingConfirmation
            bookingData={bookingData}
            doctor={doctor}
            onBackToDashboard={() => navigate('/patient/dashboard')}
            onBookAnother={() => {
              setStep(1);
              setSelectedSlot(null);
              setBookingData({});
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;