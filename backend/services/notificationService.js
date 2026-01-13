import Notification from '../models/Notification.js';
import { getChannel } from '../config/rabbitmq.js';

export const sendNotification = async (userId, type, data, actionUrl = null) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      title: getNotificationTitle(type),
      message: getNotificationMessage(type, data),
      data,
      actionUrl
    });

    await notification.save();

    // Emit real-time notification via Socket.io
    // This would be handled in the main server file

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const sendBulkNotifications = async (userIds, type, data) => {
  try {
    const notifications = userIds.map(userId => ({
      user: userId,
      type,
      title: getNotificationTitle(type),
      message: getNotificationMessage(type, data),
      data,
      read: false
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};

export const scheduleNotification = async (userId, type, data, scheduleTime) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      title: getNotificationTitle(type),
      message: getNotificationMessage(type, data),
      data,
      read: false,
      expiresAt: scheduleTime
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
};

const getNotificationTitle = (type) => {
  const titles = {
    appointment_booked: 'Appointment Booked',
    appointment_confirmed: 'Appointment Confirmed',
    appointment_cancelled: 'Appointment Cancelled',
    appointment_reminder: 'Appointment Reminder',
    prescription_created: 'New Prescription',
    prescription_validated: 'Prescription Validated',
    medicine_reminder: 'Medicine Reminder',
    order_placed: 'Order Placed',
    order_shipped: 'Order Shipped',
    order_delivered: 'Order Delivered',
    payment_success: 'Payment Successful',
    payment_failed: 'Payment Failed',
    system_alert: 'System Alert'
  };
  return titles[type] || 'Notification';
};

const getNotificationMessage = (type, data) => {
  const messages = {
    appointment_booked: `Appointment booked with Dr. ${data.doctorName} on ${data.date}`,
    appointment_reminder: `Reminder: Your appointment with Dr. ${data.doctorName} is in 24 hours`,
    prescription_created: `New prescription available from Dr. ${data.doctorName}`,
    medicine_reminder: `Time to take your ${data.medicineName} medication`,
    order_placed: `Your order #${data.orderId} has been placed successfully`,
    order_delivered: `Your order #${data.orderId} has been delivered`
  };
  return messages[type] || 'You have a new notification';
};