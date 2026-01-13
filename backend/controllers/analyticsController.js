import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    let stats = {};

    if (userRole === 'admin') {
      // Admin dashboard stats
      const [
        totalPatients,
        totalDoctors,
        totalAppointments,
        medicineRevenue,
        appointmentRevenue,
        recentAppointments,
        pendingPrescriptions
      ] = await Promise.all([
        User.countDocuments({ role: 'patient', isActive: true }),
        User.countDocuments({ role: 'doctor', isActive: true, isVerified: true }),
        Appointment.countDocuments(),
        Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
        Appointment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$consultationFee' } } }]),
        Appointment.find().populate('patient doctor').sort({ createdAt: -1 }).limit(5),
        Prescription.countDocuments({ status: 'pending' })
      ]);

      stats = {
        totalPatients,
        totalDoctors,
        totalAppointments,
        medicineRevenue: medicineRevenue[0]?.total || 0,
        appointmentRevenue: appointmentRevenue[0]?.total || 0,
        totalRevenue: (medicineRevenue[0]?.total || 0) + (appointmentRevenue[0]?.total || 0),
        recentAppointments,
        pendingPrescriptions
      };
    } else if (userRole === 'doctor') {
      // Doctor dashboard stats
      const doctorId = req.user.id;

      const [
        todayAppointments,
        totalAppointments,
        completedAppointments,
        totalEarnings,
        upcomingAppointments
      ] = await Promise.all([
        Appointment.countDocuments({
          doctor: doctorId,
          date: {
            $gte: new Date().setHours(0, 0, 0, 0),
            $lte: new Date().setHours(23, 59, 59, 999)
          }
        }),
        Appointment.countDocuments({ doctor: doctorId }),
        Appointment.countDocuments({ doctor: doctorId, status: 'completed' }),
        Appointment.aggregate([
          { $match: { doctor: doctorId, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$consultationFee' } } }
        ]),
        Appointment.find({
          doctor: doctorId,
          date: { $gte: new Date() },
          status: { $in: ['scheduled', 'confirmed'] }
        })
          .populate('patient', 'name')
          .sort({ date: 1 })
          .limit(5)
      ]);

      stats = {
        todayAppointments,
        totalAppointments,
        completedAppointments,
        totalEarnings: totalEarnings[0]?.total || 0,
        upcomingAppointments
      };
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentAnalytics = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;

    const startDate = getStartDate(period);

    const appointments = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;

    const startDate = getStartDate(period);

    const revenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      revenue
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAnalytics = async (req, res, next) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    const growth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      userStats,
      growth
    });
  } catch (error) {
    next(error);
  }
};

const getStartDate = (period) => {
  const now = new Date();
  switch (period) {
    case 'day':
      return new Date(now.setHours(0, 0, 0, 0));
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setMonth(now.getMonth() - 1));
  }
};