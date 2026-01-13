import React from 'react';
import { useNotifications } from '../../../hooks/useNotifications';
import { formatDate, formatTime } from '../../../utils/helpers';
import './NotificationList.css';

const NotificationList = ({ onClose }) => {
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification._id);
        }

        // Handle navigation based on notification type
        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    return (
        <div className="notification-list">
            <div className="notification-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                    <button onClick={markAllAsRead} className="mark-all-btn">
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notifications-container">
                {notifications.length === 0 ? (
                    <div className="no-notifications">
                        <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p>No notifications</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${!notification.read ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </div>

                            <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <span className="notification-time">
                                    {formatDate(notification.createdAt)} at {formatTime(notification.createdAt)}
                                </span>
                            </div>

                            <button
                                className="delete-notification-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification._id);
                                }}
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const getNotificationIcon = (type) => {
    switch (type) {
        case 'appointment':
            return (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        case 'prescription':
            return (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        case 'order':
            return (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            );
        case 'payment':
            return (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            );
        default:
            return (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }
};

export default NotificationList;
