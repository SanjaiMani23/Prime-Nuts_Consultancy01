import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rate limiter for authentication endpoints: 10 attempts per 15 minutes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login or registration attempts. Please wait 15 minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password reset requests: 5 attempts per hour
const resetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many password reset requests. Please wait an hour before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication endpoints
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);

// Password recovery & change
router.post('/forgot-password', resetRateLimiter, forgotPassword);
router.post('/reset-password', resetRateLimiter, resetPassword);
router.post('/change-password', authenticateToken, changePassword);

export default router;
