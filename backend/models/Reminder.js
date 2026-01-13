// models/Reminder.js
import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  schedule: {
    times: [{
      type: String, // Format: "09:00", "14:30"
      required: true
    }],
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom'],
      default: 'daily'
    },
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  notes: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  lastTaken: Date,
  takenCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

reminderSchema.index({ user: 1, status: 1 });
reminderSchema.index({ endDate: 1 });

export default mongoose.model('Reminder', reminderSchema);