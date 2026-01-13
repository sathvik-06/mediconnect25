// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'pharmacist', 'admin'],
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profilePicture: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  preferences: {
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
      // smsNotifications: { type: Boolean, default: false },
      appointmentReminders: { type: Boolean, default: true },
      medicineReminders: { type: Boolean, default: true },
      promotionalEmails: { type: Boolean, default: true },
      // promotionalEmails: { type: Boolean, default: false },
      appointmentAlerts: { type: Boolean, default: true },
      prescriptionUpdates: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' }
  }
}, {
  timestamps: true,
  discriminatorKey: 'role'
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    console.log('Pre-save hook: Password not modified, skipping hash');
    return next();
  }

  console.log('Pre-save hook: Hashing new password');
  try {
    this.password = await bcrypt.hash(this.password, 12);
    console.log('Pre-save hook: Password hashed successfully');
    next();
  } catch (error) {
    console.error('Pre-save hook: Error hashing password', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log('Comparing passwords...');
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(`Password match result: ${isMatch}`);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);