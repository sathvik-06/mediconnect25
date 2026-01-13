// controllers/authController.js
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import jwt from 'jsonwebtoken';
import { generateToken, generateRefreshToken } from '../utils/tokenUtils.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, ...additionalData } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    let user;

    // Create user based on role
    if (role === 'doctor') {
      user = new Doctor({
        name,
        email,
        password,
        role,
        ...additionalData
      });
    } else if (role === 'patient') {
      user = new Patient({
        name,
        email,
        password,
        role,
        ...additionalData
      });
    } else {
      user = new User({
        name,
        email,
        password,
        role,
        ...additionalData
      });
    }

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in Redis
    const redisClient = req.redis;
    if (redisClient) {
      await redisClient.set(`refresh_token:${user._id}`, refreshToken, {
        EX: 30 * 24 * 60 * 60 // 30 days
      });
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      if (error.keyPattern?.licenseNumber) {
        return res.status(400).json({
          success: false,
          message: 'License number already in use. Please verify your license number.'
        });
      }
      if (error.keyPattern?.email) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use.'
        });
      }
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    console.log(`Login attempt for email: ${email}, role: ${role}`);

    // Find user
    // Note: role is optional for login in some systems, but here we might enforce it or just use email
    // If role is provided, we can check it. If not, we just find by email.
    // The original code used { email, role } which implies strict role checking.
    const query = { email };
    if (role) query.role = role;

    const user = await User.findOne(query).select('+password');

    if (!user) {
      console.log('User not found with these credentials');
      return res.status(401).json({
        success: false,
        message: 'User not found with this email and role'
      });
    }

    console.log(`User found: ${user._id}, checking password...`);

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log('Password comparison failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    console.log('Password valid, proceeding to login');

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in Redis
    const redisClient = req.redis;
    if (redisClient) {
      await redisClient.set(`refresh_token:${user._id}`, refreshToken, {
        EX: 30 * 24 * 60 * 60 // 30 days
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if refresh token exists in Redis
    const redisClient = req.redis;
    const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // Update refresh token in Redis
    await redisClient.set(`refresh_token:${decoded.userId}`, newRefreshToken, {
      EX: 30 * 24 * 60 * 60
    });

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Remove refresh token from Redis
    const redisClient = req.redis;
    await redisClient.del(`refresh_token:${userId}`);

    // Add token to blacklist
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.decode(token);
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redisClient.set(`blacklist:${token}`, 'true', { EX: ttl });
      }
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req, res, next) => {
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this phone number'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with 10 minute expiration
    const redisClient = req.redis;
    await redisClient.set(`otp:${phone}`, otp, {
      EX: 600 // 10 minutes
    });

    // In development, we also log it
    console.log(`[OTP GENERATED] Phone: ${phone}, OTP: ${otp}`);

    // Format phone number for Twilio (E.164 format)
    // Assuming Indian numbers if no country code provided
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    // Import dynamically to avoid circular dependencies if any
    const { sendOTP } = await import('../services/smsService.js');
    try {
      await sendOTP(formattedPhone, otp);
    } catch (smsError) {
      console.error('Failed to send SMS, but OTP is logged:', smsError);
    }

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const redisClient = req.redis;
    const storedOTP = await redisClient.get(`otp:${phone}`);

    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // OTP is valid, generate a reset token
    const resetToken = jwt.sign(
      { phone, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Remove used OTP
    await redisClient.del(`otp:${phone}`);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token purpose'
      });
    }

    // Find user by phone
    const user = await User.findOne({ phone: decoded.phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};