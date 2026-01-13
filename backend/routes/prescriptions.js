import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  uploadPrescription,
  getPrescriptions,
  createPrescription,
  validatePrescription,
  deletePrescription,
  downloadPrescription
} from '../controllers/prescriptionController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Patient routes
router.post('/upload', protect, authorize('patient'), upload.single('prescription'), uploadPrescription);
router.get('/', protect, authorize('patient', 'doctor', 'pharmacist'), getPrescriptions);
router.get('/:id/download', protect, downloadPrescription);
router.delete('/:id', protect, authorize('patient', 'doctor', 'pharmacist'), deletePrescription);

// Doctor routes
router.post('/', protect, authorize('doctor'), createPrescription);

// Pharmacist routes
router.put('/:id/validate', protect, authorize('pharmacist', 'doctor'), validatePrescription);

export default router;