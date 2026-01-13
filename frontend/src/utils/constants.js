// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

// User Roles
export const USER_ROLES = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    PHARMACY: 'pharmacy',
    ADMIN: 'admin',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESCHEDULED: 'rescheduled',
};

// Order Status
export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
};

// Notification Types
export const NOTIFICATION_TYPES = {
    APPOINTMENT: 'appointment',
    PRESCRIPTION: 'prescription',
    ORDER: 'order',
    PAYMENT: 'payment',
    REMINDER: 'reminder',
    SYSTEM: 'system',
};

// File Upload Types
export const UPLOAD_TYPES = {
    PRESCRIPTION: 'prescription',
    MEDICAL_REPORT: 'medical_report',
    PROFILE_PICTURE: 'profile_picture',
    DOCUMENT: 'document',
};

// Max File Sizes (in bytes)
export const MAX_FILE_SIZES = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    PRESCRIPTION: 10 * 1024 * 1024, // 10MB
};

// Allowed File Types
export const ALLOWED_FILE_TYPES = {
    IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    DOCUMENT: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    PRESCRIPTION: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
};

// Time Slots
export const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

// Days of Week
export const DAYS_OF_WEEK = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Specializations
export const SPECIALIZATIONS = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic',
    'Gynecologist',
    'Neurologist',
    'Psychiatrist',
    'ENT Specialist',
    'Ophthalmologist',
    'Dentist',
    'Urologist',
];

// Medicine Categories
export const MEDICINE_CATEGORIES = [
    'Antibiotics',
    'Pain Relief',
    'Vitamins',
    'Cardiac',
    'Diabetes',
    'Respiratory',
    'Digestive',
    'Skin Care',
    'Mental Health',
    'Other',
];

// Voice Commands
export const VOICE_COMMANDS = {
    BOOK_APPOINTMENT: ['book appointment', 'schedule appointment', 'make appointment'],
    SEARCH_DOCTOR: ['search doctor', 'find doctor', 'look for doctor'],
    VIEW_APPOINTMENTS: ['view appointments', 'show appointments', 'my appointments'],
    UPLOAD_PRESCRIPTION: ['upload prescription', 'add prescription'],
    VIEW_HISTORY: ['view history', 'medical history', 'show history'],
    HELP: ['help', 'what can you do', 'commands'],
};

// Razorpay Configuration
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_key';

// Pagination
export const ITEMS_PER_PAGE = 10;
export const DOCTORS_PER_PAGE = 12;
export const APPOINTMENTS_PER_PAGE = 10;
export const ORDERS_PER_PAGE = 10;

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

// Regex Patterns
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[6-9]\d{9}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    PIN_CODE: /^\d{6}$/,
};

export default {
    API_BASE_URL,
    WS_BASE_URL,
    USER_ROLES,
    APPOINTMENT_STATUS,
    ORDER_STATUS,
    PAYMENT_STATUS,
    NOTIFICATION_TYPES,
    UPLOAD_TYPES,
    MAX_FILE_SIZES,
    ALLOWED_FILE_TYPES,
    TIME_SLOTS,
    DAYS_OF_WEEK,
    SPECIALIZATIONS,
    MEDICINE_CATEGORIES,
    VOICE_COMMANDS,
    RAZORPAY_KEY,
    ITEMS_PER_PAGE,
    DOCTORS_PER_PAGE,
    APPOINTMENTS_PER_PAGE,
    ORDERS_PER_PAGE,
    DATE_FORMAT,
    TIME_FORMAT,
    DATETIME_FORMAT,
    REGEX_PATTERNS,
};
