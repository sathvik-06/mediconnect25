// queues/workers/notificationWorker.js
import { connectRabbitMQ } from '../../config/rabbitmq.js';
import Notification from '../../models/Notification.js';

export const startNotificationWorker = async () => {
  try {
    const channel = await connectRabbitMQ();

    if (!channel) {
      console.log('RabbitMQ not available, skipping notification worker start');
      return;
    }

    console.log('Notification worker started...');

    // Ensure the queue exists
    await channel.assertQueue('notification_queue', { durable: true });

    channel.consume('notification_queue', async (msg) => {
      if (msg !== null) {
        try {
          const notificationData = JSON.parse(msg.content.toString());

          // Create notification in database
          const notification = new Notification({
            user: notificationData.userId,
            type: notificationData.type,
            title: getNotificationTitle(notificationData.type),
            message: getNotificationMessage(notificationData.type, notificationData.data),
            data: notificationData.data,
            actionUrl: getActionUrl(notificationData.type, notificationData)
          });

          await notification.save();

          // Here you would also send push notifications, SMS, etc.
          console.log(`Notification created for user ${notificationData.userId}`);

          channel.ack(msg);
        } catch (error) {
          console.error('Error processing notification:', error);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('Notification worker error:', error);
    process.exit(1);
  }
};

const getNotificationTitle = (type) => {
  const titles = {
    appointment_booked: 'Appointment Booked',
    appointment_cancelled: 'Appointment Cancelled',
    appointment_reminder: 'Appointment Reminder',
    patient_checked_in: 'Patient Checked In',
    consultation_completed: 'Consultation Completed',
    prescription_created: 'New Prescription',
    prescription_validated: 'Prescription Validated',
    medicine_reminder: 'Medicine Reminder'
  };
  return titles[type] || 'Notification';
};

const getNotificationMessage = (type, data) => {
  const messages = {
    appointment_booked: data.role === 'doctor'
      ? `New appointment with ${data.patientName} on ${data.date} at ${data.time}`
      : `Appointment booked with Dr. ${data.doctorName} on ${data.date} at ${data.time}`,
    appointment_cancelled: data.patientName
      ? `${data.patientName} cancelled appointment on ${data.date} at ${data.time}${data.reason ? `. Reason: ${data.reason}` : ''}`
      : `Appointment with Dr. ${data.doctorName} has been cancelled`,
    appointment_reminder: `Reminder: Appointment with Dr. ${data.doctorName} in 24 hours`,
    patient_checked_in: `${data.patientName} has checked in for ${data.time} appointment`,
    consultation_completed: `Your consultation with Dr. ${data.doctorName} on ${data.date} is complete${data.diagnosis ? `. Diagnosis: ${data.diagnosis}` : ''}`,
    prescription_created: `New prescription available from Dr. ${data.doctorName}`,
    prescription_validated: `Your prescription has been ${data.status}`
  };
  return messages[type] || 'You have a new notification';
};

const getActionUrl = (type, notificationData) => {
  const data = notificationData.data || {};

  if (type === 'appointment_booked' && data.role === 'doctor') {
    return '/doctor/dashboard';
  }

  const urls = {
    appointment_booked: `/patient/appointments/${data.appointmentId}`,
    prescription_created: `/patient/prescriptions/${data.prescriptionId}`,
    prescription_validated: `/patient/prescriptions/${data.prescriptionId}`
  };
  return urls[type] || '/patient/notifications';
};