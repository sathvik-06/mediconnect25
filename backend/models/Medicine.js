import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  composition: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'analgesic',
      'antibiotic',
      'antihistamine',
      'antacid',
      'vitamin',
      'cardiovascular',
      'diabetes',
      'respiratory',
      'gastrointestinal',
      'dermatological',
      'other'
    ]
  },
  form: {
    type: String,
    required: true,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'cream', 'drops', 'inhaler']
  },
  strength: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minStock: {
    type: Number,
    default: 10
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  sideEffects: [String],
  contraindications: [String],
  dosage: String,
  storage: String,
  expiryDate: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
medicineSchema.index({ name: 'text', genericName: 'text', manufacturer: 'text' });
medicineSchema.index({ category: 1 });
medicineSchema.index({ stock: 1 });

export default mongoose.model('Medicine', medicineSchema);