// models/Patient.js
import mongoose from 'mongoose';
import User from './User.js';

const patientSchema = new mongoose.Schema({
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
      default: 'active'
    },
    notes: String
  }],
  allergies: [{
    allergen: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    reaction: String
  }],
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    validUntil: Date
  }
});

export default User.discriminator('patient', patientSchema);