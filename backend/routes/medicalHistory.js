// src/routes/medicalHistory.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getAppointmentHistory,
    getPrescriptions,
    getMedicalReports
} from '../controllers/medicalHistoryController.js';

const router = express.Router();

// All routes are protected; only authenticated patients can access
router.get('/appointments', protect, getAppointmentHistory);
router.get('/prescriptions', protect, getPrescriptions);
router.get('/reports', protect, getMedicalReports);

export default router;
