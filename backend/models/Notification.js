// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'appointment_booked',
      'appointment_cancelled',
      'appointment_reminder',
      'patient_checked_in',
      'consultation_completed',
      'prescription_created',
      'prescription_validated',
      'medicine_reminder',
      'payment_success',
      'system_alert'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  data: mongoose.Schema.Types.Mixed, // Additional data
  actionUrl: String, // URL for action
  expiresAt: Date
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Notification', notificationSchema);