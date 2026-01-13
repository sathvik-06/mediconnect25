import React, { createContext, useState, useContext, useEffect } from 'react';
import { notificationsService } from '../services/api/notifications';
import { socketService } from '../services/websocket/socketService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            fetchNotifications();
            setupWebSocket();
        } else {
            setNotifications([]);
            setUnreadCount(0);
            socketService.disconnect();
        }

        return () => {
            socketService.disconnect();
        };
    }, [token]);

    const setupWebSocket = () => {
        // Connect to socket first before setting up listeners
        socketService.connect(token);
        socketService.on('notification', handleNewNotification);
    };

    const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico'
            });
        }
    };

    const fetchNotifications = async () => {
        // Only fetch if user is authenticated
        if (!token) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        try {
            setLoading(true);
            const response = await notificationsService.getAll();
            setNotifications(response.notifications || []);
            setUnreadCount(response.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            // Set empty state on error to prevent UI issues
            setNotifications([]);
            setUnreadCount(0);
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
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            // console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationsService.markAllAsRead();
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            setUnreadCount(0);
        } catch (error) {
            // console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await notificationsService.delete(notificationId);
            setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        } catch (error) {
            // console.error('Failed to delete notification:', error);
        }
    };

    const clearAll = async () => {
        try {
            await notificationsService.clearAll();
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            // console.error('Failed to clear notifications:', error);
        }
    };

    const requestPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        requestPermission,
        refresh: fetchNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export default NotificationContext;
