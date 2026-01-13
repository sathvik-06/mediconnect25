import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';

export const getAppointmentTrends = async (startDate, endDate, doctorId = null) => {
  try {
    const matchStage = {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    };

    if (doctorId) {
      matchStage.doctor = doctorId;
    }

    const trends = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return trends;
  } catch (error) {
    console.error('Error getting appointment trends:', error);
    throw error;
  }
};

export const getRevenueAnalytics = async (startDate, endDate) => {
  try {
    const revenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return revenue;
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    throw error;
  }
};

export const getUserGrowth = async (startDate, endDate) => {
  try {
    const growth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          patients: {
            $sum: { $cond: [{ $eq: ['$role', 'patient'] }, 1, 0] }
          },
          doctors: {
            $sum: { $cond: [{ $eq: ['$role', 'doctor'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return growth;
  } catch (error) {
    console.error('Error getting user growth:', error);
    throw error;
  }
};

export const getDoctorPerformance = async (doctorId, startDate, endDate) => {
  try {
    const performance = await Appointment.aggregate([
      {
        $match: {
          doctor: doctorId,
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$consultationFee' }
        }
      }
    ]);

    const ratings = await User.aggregate([
      { $match: { _id: doctorId } },
      { $unwind: '$rating.reviews' },
      {
        $group: {
          _id: '$_id',
          averageRating: { $avg: '$rating.reviews.rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    return {
      appointmentStats: performance,
      ratingStats: ratings[0] || { averageRating: 0, totalReviews: 0 }
    };
  } catch (error) {
    console.error('Error getting doctor performance:', error);
    throw error;
  }
};