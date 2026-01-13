import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  markAsTaken,
  getDueReminders
} from '../controllers/reminderController.js';

const router = express.Router();

router.use(protect, authorize('patient'));

router.get('/', getReminders);
router.get('/due', getDueReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);
router.put('/:id/taken', markAsTaken);

export default router;