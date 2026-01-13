import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorAvailability,
  updateDoctorProfile,
  getDoctorPatients,
  getDoctorPatientHistory,
  getDashboardStats
} from '../controllers/doctorController.js';
import { getDoctorAppointments } from '../controllers/appointmentController.js';

const router = express.Router();

// Protected routes
router.get('/dashboard-stats', protect, authorize('doctor'), getDashboardStats);
router.get('/patients', protect, authorize('doctor'), getDoctorPatients);
router.get('/patients/:patientId/history', protect, authorize('doctor'), getDoctorPatientHistory);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.get('/:id/appointments', protect, authorize('doctor'), getDoctorAppointments);

export default router;