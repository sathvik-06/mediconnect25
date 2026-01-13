// src/components/patient/Reminders/ReminderList.js
import React from 'react';
import ReminderItem from './ReminderItem';
import './ReminderList.css';

const ReminderList = ({ 
  title, 
  reminders, 
  onMarkAsTaken, 
  onEdit, 
  onDelete, 
  emptyMessage,
  completed = false 
}) => {
  const getNextDoseTime = (reminder) => {
    const now = new Date();
    const times = reminder.schedule.times;
    
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

  const isDueSoon = (reminder) => {
    const nextDose = getNextDoseTime(reminder);
    return nextDose && (nextDose - new Date()) <= 30 * 60 * 1000;
  };

  const sortReminders = (reminders) => {
    return [...reminders].sort((a, b) => {
      const aDue = isDueSoon(a);
      const bDue = isDueSoon(b);
      
      if (aDue && !bDue) return -1;
      if (!aDue && bDue) return 1;
      
      const aNext = getNextDoseTime(a);
      const bNext = getNextDoseTime(b);
      
      return aNext - bNext;
    });
  };

  const sortedReminders = sortReminders(reminders);

  return (
    <div className="reminder-list">
      <div className="list-header">
        <h3>{title}</h3>
        <span className="reminder-count">{reminders.length}</span>
      </div>

      {sortedReminders.length === 0 ? (
        <div className="empty-reminders">
          <div className="empty-icon">💊</div>
          <h4>No Reminders</h4>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="reminders-grid">
          {sortedReminders.map(reminder => (
            <ReminderItem
              key={reminder._id}
              reminder={reminder}
              onMarkAsTaken={onMarkAsTaken}
              onEdit={onEdit}
              onDelete={onDelete}
              isDueSoon={isDueSoon(reminder)}
              completed={completed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderList;