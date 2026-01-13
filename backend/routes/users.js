import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  updateUserStatus
} from '../controllers/userController.js';

const router = express.Router();

// User routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);

export default router;