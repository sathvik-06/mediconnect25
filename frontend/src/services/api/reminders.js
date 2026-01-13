// src/services/api/reminders.js
import api from './config.js';

export const remindersService = {
  async getReminders() {
    const response = await api.get('/reminders');
    return response.reminders;
  },

  async createReminder(reminderData) {
    const response = await api.post('/reminders', reminderData);
    return response.reminder;
  },

  async updateReminder(reminderId, updates) {
    const response = await api.put(`/reminders/${reminderId}`, updates);
    return response.reminder;
  },

  async deleteReminder(reminderId) {
    const response = await api.delete(`/reminders/${reminderId}`);
    return response;
  },

  async markAsTaken(reminderId) {
    const response = await api.post(`/reminders/${reminderId}/taken`);
    return response;
  },

  async getDueReminders() {
    const response = await api.get('/reminders/due');
    return response.reminders;
  }
};