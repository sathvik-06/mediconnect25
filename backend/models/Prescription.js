// models/Prescription.js
import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: String,
  medicines: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: String,
    notes: String
  }],
  notes: String,
  fileUrl: String, // For uploaded prescriptions
  fileName: String,
  fileSize: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  validationNotes: String,
  medicinesDetected: [{
    name: String,
    confidence: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isDeletedByDoctor: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Prescription', prescriptionSchema);