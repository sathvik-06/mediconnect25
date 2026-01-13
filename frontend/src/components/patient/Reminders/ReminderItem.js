// src/components/patient/Reminders/ReminderItem.js
import React, { useState } from 'react';
import './ReminderItem.css';

const ReminderItem = ({ 
  reminder, 
  onMarkAsTaken, 
  onEdit, 
  onDelete, 
  isDueSoon,
  completed = false 
}) => {
  const [showActions, setShowActions] = useState(false);

  const {
    _id,
    medicineName,
    dosage,
    schedule,
    startDate,
    endDate,
    notes,
    lastTaken
  } = reminder;

  const getNextDoseTime = () => {
    const now = new Date();
    const times = schedule.times;
    
    for (const time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const doseTime = new Date();
      doseTime.setHours(hours, minutes, 0, 0);
      
      if (doseTime > now) {
        return doseTime;
      }
    }
    
    if (times.length > 0) {
      const [hours, minutes] = times[0].split(':').map(Number);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(hours, minutes, 0, 0);
      return tomorrow;
    }
    
    return null;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeLeft = (nextDose) => {
    const now = new Date();
    const diff = nextDose - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `in ${minutes}m`;
    } else {
      return 'Now';
    }
  };

  const nextDose = getNextDoseTime();
  const isActive = new Date(endDate) >= new Date();

  return (
    <div 
      className={`reminder-item ${isDueSoon ? 'due-soon' : ''} ${completed ? 'completed' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="reminder-header">
        <div className="medicine-info">
          <h4 className="medicine-name">{medicineName}</h4>
          <p className="medicine-dosage">{dosage}</p>
        </div>
        
        <div className="reminder-status">
          {!completed && isDueSoon && (
            <span className="status-badge due">Due Soon</span>
          )}
          {completed && (
            <span className="status-badge completed">Completed</span>
          )}
          {!completed && !isDueSoon && isActive && (
            <span className="status-badge active">Active</span>
          )}
        </div>
      </div>

      <div className="reminder-schedule">
        <div className="schedule-times">
          <strong>Schedule:</strong>
          {schedule.times.map((time, index) => (
            <span key={index} className="time-slot">
              {formatTime(new Date(`2000-01-01T${time}`))}
            </span>
          ))}
        </div>
        
        {schedule.frequency && (
          <div className="schedule-frequency">
            <strong>Frequency:</strong> {schedule.frequency}
          </div>
        )}
      </div>

      {nextDose && !completed && (
        <div className="next-dose">
          <strong>Next Dose:</strong> {formatTime(nextDose)} ({formatTimeLeft(nextDose)})
        </div>
      )}

      {notes && (
        <div className="reminder-notes">
          <strong>Notes:</strong> {notes}
        </div>
      )}

      <div className="reminder-dates">
        <span>Start: {new Date(startDate).toLocaleDateString()}</span>
        <span>End: {new Date(endDate).toLocaleDateString()}</span>
      </div>

      {showActions && !completed && (
        <div className="reminder-actions">
          <button
            className="btn-action taken"
            onClick={() => onMarkAsTaken(_id)}
            title="Mark as taken"
          >
            ✅
          </button>
          <button
            className="btn-action edit"
            onClick={() => onEdit(_id, reminder)}
            title="Edit reminder"
          >
            ✏️
          </button>
          <button
            className="btn-action delete"
            onClick={() => onDelete(_id)}
            title="Delete reminder"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default ReminderItem;