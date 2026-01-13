// src/components/common/NotificationBell/NotificationBell.js

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../../contexts/NotificationContext';
import NotificationList from './NotificationList';
import './NotificationBell.css';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, refresh } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  // refresh on mount is handled by context, but we can exposure it if needed
  // No need for polling here as Context handles socket updates

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="notification-bell">
      <button className="bell-button" onClick={toggleDropdown}>
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="dropdown-overlay"
            onClick={() => setShowDropdown(false)}
          />
          <NotificationList
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onClose={() => setShowDropdown(false)}
          />
        </>
      )}
    </div>
  );
};

export default NotificationBell;