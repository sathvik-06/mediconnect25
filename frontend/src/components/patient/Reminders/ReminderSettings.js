// src/components/patient/Reminders/ReminderSettings.js
import React, { useState } from 'react';
import './ReminderSettings.css';

const ReminderSettings = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    schedule: {
      times: ['09:00'],
      frequency: 'daily',
      days: []
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const timeOptions = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleScheduleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  const handleTimeAdd = () => {
    if (formData.schedule.times.length < 5) {
      handleScheduleChange('times', [...formData.schedule.times, '09:00']);
    }
  };

  const handleTimeRemove = (index) => {
    if (formData.schedule.times.length > 1) {
      const newTimes = formData.schedule.times.filter((_, i) => i !== index);
      handleScheduleChange('times', newTimes);
    }
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.schedule.times];
    newTimes[index] = value;
    handleScheduleChange('times', newTimes);
  };

  const handleDayToggle = (day) => {
    const currentDays = formData.schedule.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    handleScheduleChange('days', newDays);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.medicineName.trim()) {
      newErrors.medicineName = 'Medicine name is required';
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage information is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.schedule.frequency === 'weekly' && (!formData.schedule.days || formData.schedule.days.length === 0)) {
      newErrors.days = 'Please select at least one day for weekly schedule';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error('Error saving reminder:', error);
      }
    }
  };

  return (
    <div className="reminder-settings-modal">
      <div className="modal-overlay" onClick={onClose} />
      
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Medicine Reminder</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="reminder-form">
          <div className="form-section">
            <h4>Medicine Information</h4>
            
            <div className="form-group">
              <label htmlFor="medicineName" className="form-label">
                Medicine Name *
              </label>
              <input
                type="text"
                id="medicineName"
                className={`form-input ${errors.medicineName ? 'error' : ''}`}
                value={formData.medicineName}
                onChange={(e) => handleChange('medicineName', e.target.value)}
                placeholder="Enter medicine name"
              />
              {errors.medicineName && (
                <span className="error-text">{errors.medicineName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dosage" className="form-label">
                Dosage *
              </label>
              <input
                type="text"
                id="dosage"
                className={`form-input ${errors.dosage ? 'error' : ''}`}
                value={formData.dosage}
                onChange={(e) => handleChange('dosage', e.target.value)}
                placeholder="e.g., 1 tablet, 5ml syrup"
              />
              {errors.dosage && (
                <span className="error-text">{errors.dosage}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h4>Schedule</h4>
            
            <div className="form-group">
              <label className="form-label">Times *</label>
              <div className="times-list">
                {formData.schedule.times.map((time, index) => (
                  <div key={index} className="time-input-group">
                    <select
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="form-input time-select"
                    >
                      {timeOptions.map(option => (
                        <option key={option} value={option}>
                          {new Date(`2000-01-01T${option}`).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </option>
                      ))}
                    </select>
                    {formData.schedule.times.length > 1 && (
                      <button
                        type="button"
                        className="remove-time"
                        onClick={() => handleTimeRemove(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {formData.schedule.times.length < 5 && (
                  <button
                    type="button"
                    className="add-time"
                    onClick={handleTimeAdd}
                  >
                    + Add Time
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="frequency" className="form-label">
                Frequency
              </label>
              <select
                id="frequency"
                className="form-input"
                value={formData.schedule.frequency}
                onChange={(e) => handleScheduleChange('frequency', e.target.value)}
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.schedule.frequency === 'weekly' && (
              <div className="form-group">
                <label className="form-label">Days *</label>
                {errors.days && (
                  <span className="error-text">{errors.days}</span>
                )}
                <div className="days-grid">
                  {dayOptions.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      className={`day-button ${formData.schedule.days?.includes(day.value) ? 'selected' : ''}`}
                      onClick={() => handleDayToggle(day.value)}
                    >
                      {day.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h4>Duration</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  className={`form-input ${errors.endDate ? 'error' : ''}`}
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  min={formData.startDate}
                />
                {errors.endDate && (
                  <span className="error-text">{errors.endDate}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Additional Notes
              </label>
              <textarea
                id="notes"
                className="form-input"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any special instructions or notes"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderSettings;