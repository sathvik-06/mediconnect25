// controllers/notificationController.js
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments({ user: userId });
    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false
    });

    res.json({
      success: true,
      notifications,
      total,
      unreadCount,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getNotificationSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      settings: user.preferences.notifications
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotificationSettings = async (req, res, next) => {
  try {
    const settings = req.body;

    // Validate that we only update allowed fields
    console.log('Received settings update request:', JSON.stringify(settings, null, 2));
    const allowedSettings = [
      'emailNotifications',
      'pushNotifications',
      'smsNotifications',
      'appointmentReminders',
      'medicineReminders',
      'promotionalEmails',
      'appointmentAlerts',
      'prescriptionUpdates',
      'systemUpdates'
    ];

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Merge new settings with existing ones
    // We iterate over allowed keys to prevent pollution
    allowedSettings.forEach(key => {
      if (settings.hasOwnProperty(key)) {
        user.preferences.notifications[key] = settings[key];
      }
    });

    await user.save();
    console.log('Settings saved to database for user:', user._id);
    console.log('New user preferences:', JSON.stringify(user.preferences.notifications, null, 2));

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings: user.preferences.notifications
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({
      user: userId,
      read: false
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};