// src/components/patient/AppointmentBooking/TimeSlotPicker.js
import React from 'react';
import './TimeSlotPicker.css';

const TimeSlotPicker = ({
  doctor,
  selectedDate,
  selectedSlot,
  availability,
  onDateSelect,
  onSlotSelect,
  onNext
}) => {
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  // Get next 7 days for date selection
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      });
    }

    return dates;
  };

  // Helper to convert 24h to 12h format
  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours, 10);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const isSlotAvailable = (slot) => {
    // Backend returns 24h format (e.g. "14:00"), Frontend uses "02:00 PM"
    return availability.some(avail => {
      const availTime12 = convertTo12Hour(avail.time);
      return availTime12 === slot && avail.available;
    });
  };

  const formatSelectedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="time-slot-picker">
      <div className="picker-header">
        <h3>Select Date & Time</h3>
        <p>Choose your preferred appointment slot</p>
      </div>

      <div className="date-selection">
        <h4>Select Date</h4>
        <div className="date-options">
          {getDateOptions().map(date => (
            <button
              key={date.value}
              className={`date-option ${selectedDate === date.value ? 'selected' : ''}`}
              onClick={() => onDateSelect(date.value)}
            >
              {date.label}
            </button>
          ))}
        </div>
      </div>

      <div className="time-selection">
        <h4>
          Available Slots for {formatSelectedDate(selectedDate)}
          {doctor && ` with Dr. ${doctor.name}`}
        </h4>

        <div className="time-slots-grid">
          {timeSlots.map(slot => {
            const available = isSlotAvailable(slot);
            const isSelected = selectedSlot && selectedSlot.time === slot;

            return (
              <button
                key={slot}
                className={`time-slot ${isSelected ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                onClick={() => available && onSlotSelect({ time: slot, available })}
                disabled={!available}
              >
                {slot}
                {!available && <span className="slot-status">Booked</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="picker-actions">
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!selectedSlot}
        >
          Continue to Patient Details
        </button>
      </div>

      {selectedSlot && (
        <div className="selected-slot-info">
          <h4>Selected Appointment</h4>
          <p>
            <strong>Date:</strong> {formatSelectedDate(selectedDate)}<br />
            <strong>Time:</strong> {selectedSlot.time}<br />
            <strong>Doctor:</strong> Dr. {doctor.name}<br />
            <strong>Fee:</strong> ₹{doctor.consultationFee}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;