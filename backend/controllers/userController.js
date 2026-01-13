import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const getProfile = async (req, res, next) => {
  try {
    let user;
    
    if (req.user.role === 'patient') {
      user = await Patient.findById(req.user.id);
    } else if (req.user.role === 'doctor') {
      user = await Doctor.findById(req.user.id);
    } else {
      user = await User.findById(req.user.id);
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let user;
    
    if (req.user.role === 'patient') {
      user = await Patient.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true, runValidators: true }
      );
    } else if (req.user.role === 'doctor') {
      user = await Doctor.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      user = await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });
    
    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (role) query.role = role;
    
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, isVerified } = req.body;
    
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (isVerified !== undefined) updates.isVerified = isVerified;
    
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};