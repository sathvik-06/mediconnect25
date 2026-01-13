// models/Doctor.js
import mongoose from 'mongoose';
import User from './User.js';

const doctorSchema = new mongoose.Schema({
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  qualifications: [{
    degree: String,
    university: String,
    year: Number
  }],
  experience: {
    type: Number,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  hospital: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    phone: String
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availability: {
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    workingHours: {
      start: String, // Format: "09:00"
      end: String    // Format: "17:00"
    }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    reviews: [{
      patient: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

export default User.discriminator('doctor', doctorSchema);