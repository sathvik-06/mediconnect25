// routes/auth.js
import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  verifyToken,
  forgotPassword,
  verifyOTP,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/verify', protect, verifyToken);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

export default router;