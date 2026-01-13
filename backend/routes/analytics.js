import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDashboardStats,
  getAppointmentAnalytics,
  getRevenueAnalytics,
  getUserAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

router.use(protect);

// Admin analytics
router.get('/dashboard', authorize('admin'), getDashboardStats);
router.get('/appointments', authorize('admin'), getAppointmentAnalytics);
router.get('/revenue', authorize('admin'), getRevenueAnalytics);
router.get('/users', authorize('admin'), getUserAnalytics);

// Doctor analytics
router.get('/doctor/dashboard', authorize('doctor'), getDashboardStats);

export default router;