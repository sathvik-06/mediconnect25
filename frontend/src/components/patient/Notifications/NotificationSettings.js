// src/components/patient/Notifications/NotificationSettings.js
import React, { useState, useEffect } from 'react';
import { notificationsService } from '../../../services/api/notifications';
import './NotificationSettings.css';

const NotificationSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    medicineReminders: true,
    promotionalEmails: false,
    appointmentAlerts: true,
    prescriptionUpdates: true,
    systemUpdates: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsData = await notificationsService.getSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await notificationsService.updateSettings(settings);
      // Show success message
      alert('Notification settings updated successfully!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h3>Notification Settings</h3>
        <p>Manage how you receive notifications from MediConnect</p>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h4>Notification Channels</h4>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="emailNotifications" className="setting-label">
                  Email Notifications
                </label>
                <p className="setting-description">
                  Receive notifications via email
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={() => handleSettingChange('emailNotifications')}
                  className="toggle-switch"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="pushNotifications" className="setting-label">
                  Push Notifications
                </label>
                <p className="setting-description">
                  Receive push notifications in your browser
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={() => handleSettingChange('pushNotifications')}
                  className="toggle-switch"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="smsNotifications" className="setting-label">
                  SMS Notifications
                </label>
                <p className="setting-description">
                  Receive important alerts via SMS
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={() => handleSettingChange('smsNotifications')}
                  className="toggle-switch"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h4>Notification Types</h4>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="appointmentReminders" className="setting-label">
                  Appointment Reminders
                </label>
                <p className="setting-description">
                  Reminders for upcoming appointments
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="appointmentReminders"
                  checked={settings.appointmentReminders}
                  onChange={() => handleSettingChange('appointmentReminders')}
                  className="toggle-switch"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="medicineReminders" className="setting-label">
                  Medicine Reminders
                </label>
                <p className="setting-description">
                  Reminders to take your medicines
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="medicineReminders"
                  checked={settings.medicineReminders}
                  onChange={() => handleSettingChange('medicineReminders')}
                  className="toggle-switch"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="prescriptionUpdates" className="setting-label">
                  Prescription Updates
                </label>
                <p className="setting-description">
                  Notifications when new prescriptions are available
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="prescriptionUpdates"
                  checked={settings.prescriptionUpdates}
                  onChange={() => handleSettingChange('prescriptionUpdates')}
                  className="toggle-switch"
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="appointmentAlerts" className="setting-label">
                  Appointment Alerts
                </label>
                <p className="setting-description">
                  Real-time alerts for appointment changes
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="appointmentAlerts"
                  checked={settings.appointmentAlerts}
                  onChange={() => handleSettingChange('appointmentAlerts')}
                  className="toggle-switch"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button 
          className="btn btn-primary" 
          onClick={saveSettings}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;