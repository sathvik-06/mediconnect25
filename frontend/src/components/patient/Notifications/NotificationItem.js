// src/components/patient/Notifications/NotificationItem.js
import React from 'react';
import './NotificationItem.css';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const {
    _id,
    title,
    message,
    type,
    read,
    createdAt,
    actionUrl,
    metadata
  } = notification;

  const getIcon = () => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'medicine':
        return '💊';
      case 'reminder':
        return '⏰';
      case 'system':
        return '🔧';
      case 'payment':
        return '💰';
      default:
        return '🔔';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'appointment':
        return '#2563eb';
      case 'medicine':
        return '#059669';
      case 'reminder':
        return '#f59e0b';
      case 'system':
        return '#6b7280';
      case 'payment':
        return '#7c3aed';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleAction = () => {
    if (!read) {
      onMarkAsRead(_id);
    }
    // In a real app, this would navigate to the action URL
    if (actionUrl) {
      console.log('Navigating to:', actionUrl);
    }
  };

  return (
    <div 
      className={`notification-item ${read ? 'read' : 'unread'}`}
      onClick={handleAction}
    >
      <div className="notification-icon" style={{ color: getTypeColor() }}>
        {getIcon()}
      </div>
      
      <div className="notification-content">
        <div className="notification-header">
          <h4 className="notification-title">{title}</h4>
          <span className="notification-time">{formatTime(createdAt)}</span>
        </div>
        
        <p className="notification-message">{message}</p>
        
        {metadata && (
          <div className="notification-metadata">
            {metadata.appointmentId && (
              <span className="metadata-item">Appointment: {metadata.appointmentId}</span>
            )}
            {metadata.medicineName && (
              <span className="metadata-item">Medicine: {metadata.medicineName}</span>
            )}
          </div>
        )}
      </div>

      <div className="notification-actions">
        {!read && (
          <button 
            className="action-btn mark-read"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(_id);
            }}
            title="Mark as read"
          >
            ✓
          </button>
        )}
        <button 
          className="action-btn delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(_id);
          }}
          title="Delete notification"
        >
          ×
        </button>
      </div>

      {!read && <div className="unread-indicator"></div>}
    </div>
  );
};

export default NotificationItem;