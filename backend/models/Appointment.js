// models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'checked-in', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['in-person', 'video', 'phone'],
    default: 'in-person'
  },
  symptoms: String,
  diagnosis: String,
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  notes: String,
  followUpDate: Date,
  consultationFee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  meetingLink: String, // For video consultations
  cancellationReason: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  // NEW: Check-in tracking
  checkedInAt: {
    type: Date,
    default: null
  },
  checkedInBy: {
    type: String,
    default: null
  },
  // NEW: Consultation tracking
  consultationStartedAt: {
    type: Date,
    default: null
  },
  consultationCompletedAt: {
    type: Date,
    default: null
  },
  consultationDuration: {
    type: Number, // in minutes
    default: null
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor'
  },
  completionNotes: String
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model('Appointment', appointmentSchema);