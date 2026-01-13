// src/services/api/notifications.js
import api from './config.js';

export const notificationsService = {
  async getAll() {
    const response = await api.get('/notifications');
    return response; // Returns { success, notifications, unreadCount, total, page, pages }
  },

  async getNotifications() {
    const response = await api.get('/notifications');
    return response.notifications;
  },

  async markAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response;
  },

  async markAllAsRead() {
    const response = await api.put('/notifications/read-all');
    return response;
  },

  async delete(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response;
  },

  async deleteNotification(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response;
  },

  async clearAll() {
    const response = await api.put('/notifications/read-all');
    return response;
  },

  async getSettings() {
    const response = await api.get('/notifications/settings');
    return response.settings;
  },

  async updateSettings(settings) {
    const response = await api.put('/notifications/settings', settings);
    return response;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.count;
  }
};