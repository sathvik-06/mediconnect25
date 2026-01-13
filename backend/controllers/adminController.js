import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Pharmacy from '../models/Pharmacy.js';
import Appointment from '../models/Appointment.js';
import redisClient from '../config/redis.js';

// @desc    Get all users (with filtering)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const { role, status } = req.query;
        const query = {};

        if (role && role !== 'all') {
            query.role = role;
        }

        if (status) {
            if (status === 'verified') {
                query.isVerified = true;
            } else if (status === 'unverified') {
                query.isVerified = false;
            } else if (status === 'active') {
                query.isActive = true;
            }
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify a user (Doctor/Pharmacist)
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
export const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isVerified = true;

        if (user.role === 'doctor' || user.role === 'pharmacist') {
            user.isActive = true;
        }

        await user.save();

        if (user.role === 'doctor') {
            const pattern = 'doctors:*';
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        }

        res.json({
            success: true,
            message: `User ${user.name} verified successfully`,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users. Admin accounts are protected.'
            });
        }

        await user.deleteOne();

        if (user.role === 'doctor') {
            const pattern = 'doctors:*';
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/admin/appointments
// @access  Private/Admin
export const getAllAppointments = async (req, res, next) => {
    try {
        const { date, status, doctorId, patientId } = req.query;

        let query = {};

        // Filter by date if provided
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        // Filter by status if provided
        if (status && status !== 'all') {
            query.status = status;
        }

        // Filter by doctor if provided
        if (doctorId) {
            query.doctor = doctorId;
        }

        // Filter by patient if provided
        if (patientId) {
            query.patient = patientId;
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name specialization hospital')
            .sort({ date: -1, timeSlot: 1 });

        res.json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        next(error);
    }
};
