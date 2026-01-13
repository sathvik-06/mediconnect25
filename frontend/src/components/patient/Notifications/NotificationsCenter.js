// src/components/patient/Notifications/NotificationsCenter.js
import React, { useState, useEffect } from 'react';
import { notificationsService } from '../../../services/api/notifications';
import NotificationItem from './NotificationItem';
import NotificationSettings from './NotificationSettings';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './NotificationsCenter.css';

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notificationsData = await notificationsService.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationsService.delete(notificationId);
      setNotifications(prev =>
        prev.filter(notif => notif._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'appointments') return notification.type === 'appointment';
    if (filter === 'medicines') return notification.type === 'medicine';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="notifications-center">
      <div className="notifications-header">
        <div className="header-left">
          <h1>Notifications</h1>
          <p>Stay updated with your healthcare activities</p>
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={markAllAsRead}>
              Mark All as Read
            </button>
          )}
          <button
            className="btn btn-outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? 'Hide Settings' : 'Notification Settings'}
          </button>
        </div>
      </div>

      {showSettings && (
        <NotificationSettings onClose={() => setShowSettings(false)} />
      )}

      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
          <span className="filter-count">{notifications.length}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
          <span className="filter-count">{unreadCount}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'appointments' ? 'active' : ''}`}
          onClick={() => setFilter('appointments')}
        >
          Appointments
        </button>
        <button
          className={`filter-btn ${filter === 'medicines' ? 'active' : ''}`}
          onClick={() => setFilter('medicines')}
        >
          Medicines
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsCenter;