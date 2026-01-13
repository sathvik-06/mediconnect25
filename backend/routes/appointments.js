import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import {
  startConsultation,
  completeConsultation,
  markNoShow
} from '../controllers/appointmentWorkflowController.js';

const router = express.Router();

// Patient routes
router.post('/book', protect, authorize('patient'), bookAppointment);
router.get('/patient', protect, authorize('patient'), getPatientAppointments);

// Doctor routes
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.post('/:id/start', protect, authorize('doctor'), startConsultation);
router.post('/:id/complete', protect, authorize('doctor'), completeConsultation);
router.post('/:id/no-show', protect, authorize('doctor'), markNoShow);

// Common routes
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

export default router;