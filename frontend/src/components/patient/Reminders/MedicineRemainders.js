// src/components/patient/Reminders/MedicineReminders.js
import React, { useState, useEffect } from 'react';
import { remindersService } from '../../../services/api/reminders';
import ReminderList from './ReminderList';
import ReminderSettings from './ReminderSettings';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './MedicineReminders.css';

const MedicineReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [activeReminders, setActiveReminders] = useState([]);
  const [completedReminders, setCompletedReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const remindersData = await remindersService.getReminders();
      setReminders(remindersData);
      
      const active = remindersData.filter(reminder => 
        reminder.status === 'active' && new Date(reminder.endDate) >= new Date()
      );
      const completed = remindersData.filter(reminder => 
        reminder.status === 'completed' || new Date(reminder.endDate) < new Date()
      );
      
      setActiveReminders(active);
      setCompletedReminders(completed);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async (reminderData) => {
    try {
      const newReminder = await remindersService.createReminder(reminderData);
      setReminders(prev => [newReminder, ...prev]);
      setActiveReminders(prev => [newReminder, ...prev]);
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  };

  const updateReminder = async (reminderId, updates) => {
    try {
      const updatedReminder = await remindersService.updateReminder(reminderId, updates);
      setReminders(prev =>
        prev.map(reminder =>
          reminder._id === reminderId ? updatedReminder : reminder
        )
      );
      
      if (updates.status === 'completed' || new Date(updates.endDate) < new Date()) {
        setActiveReminders(prev => prev.filter(r => r._id !== reminderId));
        setCompletedReminders(prev => [updatedReminder, ...prev]);
      } else {
        setActiveReminders(prev =>
          prev.map(reminder =>
            reminder._id === reminderId ? updatedReminder : reminder
          )
        );
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  };

  const deleteReminder = async (reminderId) => {
    try {
      await remindersService.deleteReminder(reminderId);
      setReminders(prev => prev.filter(reminder => reminder._id !== reminderId));
      setActiveReminders(prev => prev.filter(reminder => reminder._id !== reminderId));
      setCompletedReminders(prev => prev.filter(reminder => reminder._id !== reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  };

  const markAsTaken = async (reminderId) => {
    try {
      await updateReminder(reminderId, { lastTaken: new Date().toISOString() });
    } catch (error) {
      console.error('Error marking reminder as taken:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="medicine-reminders">
      <div className="reminders-header">
        <div className="header-left">
          <h1>Medicine Reminders</h1>
          <p>Never miss your medication schedule</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowSettings(true)}
          >
            Add Reminder
          </button>
        </div>
      </div>

      <div className="reminders-stats">
        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-info">
            <h3>{activeReminders.length}</h3>
            <p>Active Reminders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{completedReminders.length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>{reminders.filter(r => isDueSoon(r)).length}</h3>
            <p>Due Soon</p>
          </div>
        </div>
      </div>

      {showSettings && (
        <ReminderSettings
          onSave={addReminder}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="reminders-content">
        <ReminderList
          title="Active Reminders"
          reminders={activeReminders}
          onMarkAsTaken={markAsTaken}
          onEdit={updateReminder}
          onDelete={deleteReminder}
          emptyMessage="No active reminders. Add a reminder to get started."
        />

        {completedReminders.length > 0 && (
          <ReminderList
            title="Completed Reminders"
            reminders={completedReminders}
            onMarkAsTaken={markAsTaken}
            onEdit={updateReminder}
            onDelete={deleteReminder}
            emptyMessage="No completed reminders yet."
            completed
          />
        )}
      </div>
    </div>
  );
};

// Helper function to check if reminder is due soon
const isDueSoon = (reminder) => {
  const now = new Date();
  const nextDose = getNextDoseTime(reminder);
  return nextDose && (nextDose - now) <= 30 * 60 * 1000; // Due in next 30 minutes
};

// Helper function to get next dose time
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
  
  // If all times passed today, return first time tomorrow
  if (times.length > 0) {
    const [hours, minutes] = times[0].split(':').map(Number);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    return tomorrow;
  }
  
  return null;
};

export default MedicineReminders;