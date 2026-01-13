import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  getUnreadCount
} from '../controllers/notificationController.js';

const router = express.Router();

router.use(protect);

router.get('/unread-count', getUnreadCount);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.get('/settings', getNotificationSettings);
router.put('/settings', updateNotificationSettings);

export default router;