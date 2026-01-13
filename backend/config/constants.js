export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  PHARMACIST: 'pharmacist',
  ADMIN: 'admin'
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show'
};

export const PRESCRIPTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const NOTIFICATION_TYPES = {
  APPOINTMENT_BOOKED: 'appointment_booked',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  PRESCRIPTION_CREATED: 'prescription_created',
  PRESCRIPTION_VALIDATED: 'prescription_validated',
  MEDICINE_REMINDER: 'medicine_reminder',
  ORDER_PLACED: 'order_placed',
  ORDER_DELIVERED: 'order_delivered'
};

export const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Gynecology',
  'Psychiatry',
  'Dentistry',
  'General Medicine'
];

export const MEDICINE_CATEGORIES = [
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
];