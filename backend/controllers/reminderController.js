// controllers/reminderController.js
import Reminder from '../models/Reminder.js';

export const getReminders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const reminders = await Reminder.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reminder.countDocuments(query);

    res.json({
      success: true,
      reminders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const createReminder = async (req, res, next) => {
  try {
    const {
      medicineName,
      dosage,
      schedule,
      startDate,
      endDate,
      notes
    } = req.body;

    const reminder = new Reminder({
      user: req.user.id,
      medicineName,
      dosage,
      schedule,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      notes,
      status: 'active'
    });

    await reminder.save();

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      reminder
    });
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reminder = await Reminder.findOne({ _id: id, user: req.user.id });
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Convert date strings to Date objects if provided
    if (updates.startDate) updates.startDate = new Date(updates.startDate);
    if (updates.endDate) updates.endDate = new Date(updates.endDate);

    const updatedReminder = await Reminder.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      reminder: updatedReminder
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reminder = await Reminder.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const markAsTaken = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { 
        lastTaken: new Date(),
        $inc: { takenCount: 1 }
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      message: 'Medicine marked as taken',
      reminder
    });
  } catch (error) {
    next(error);
  }
};

export const getDueReminders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const reminders = await Reminder.find({
      user: userId,
      status: 'active',
      endDate: { $gte: now },
      startDate: { $lte: now }
    });

    // Filter reminders that are due soon (next 30 minutes)
    const dueReminders = reminders.filter(reminder => {
      const nextDose = calculateNextDoseTime(reminder);
      return nextDose && (nextDose - now) <= 30 * 60 * 1000;
    });

    res.json({
      success: true,
      reminders: dueReminders
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate next dose time
const calculateNextDoseTime = (reminder) => {
  const now = new Date();
  const times = reminder.schedule.times;

  for (const time of times) {
    const [hours, minutes] = time.split(':').map(Number);
    const doseTime = new Date();
    doseTime.setHours(hours, minutes, 0, 0);

    if (doseTime > now) {
      return doseTime;
    }
  }

  // If all times passed today, return first time tomorrow
  if (times.length > 0) {
    const [hours, minutes] = times[0].split(':').map(Number);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    return tomorrow;
  }

  return null;
};