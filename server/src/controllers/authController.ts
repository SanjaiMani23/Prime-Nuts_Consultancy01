import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { AuthRequest, JWT_SECRET, AUTH_COOKIE_NAME, getAuthCookieOptions } from '../middleware/auth';
import User from '../models/User';
import { hashPassword, verifyPassword, needsRehash } from '../utils/password';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/;
const PASSWORD_ERROR = 'Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';

/**
 * Strips password hashes and internal security tokens from user object.
 */
const sanitizeUser = (user: any) => {
  const jsonUser = user.toJSON();
  return jsonUser;
};

/**
 * Generates signed JWT session token.
 */
const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ==========================================
// 1. REGISTER (Customers Only)
// ==========================================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      res.status(400).json({ success: false, message: PASSWORD_ERROR });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await hashPassword(password);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || '',
      password_hash: passwordHash,
      role: 'customer',
      is_active: true,
      email_verified: false,
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to The Prime Nuts.',
      user: sanitizeUser(newUser),
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error registering user.' });
  }
};

// ==========================================
// 2. LOGIN (Customer & Admin)
// ==========================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (user.is_active === false) {
      res.status(403).json({ success: false, message: 'Your account is currently unavailable. Please contact support.' });
      return;
    }

    const hashToVerify = user.password_hash || (user as any).password || '';
    const isMatch = await verifyPassword(password, hashToVerify);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (needsRehash(hashToVerify)) {
      user.password_hash = await hashPassword(password);
      if ((user as any).password) {
          (user as any).password = undefined;
      }
    }

    user.last_login_at = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    await user.save();

    const token = generateToken(user);
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    res.json({
      success: true,
      message: user.role === 'admin' ? 'Welcome back to The Prime Nuts Admin Portal!' : 'Welcome back to The Prime Nuts!',
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ==========================================
// 3. GET CURRENT USER (GET /api/auth/me)
// ==========================================
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user || user.is_active === false) {
      res.status(401).json({ success: false, message: 'User session invalid or deactivated.' });
      return;
    }

    res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user session.' });
  }
};

// ==========================================
// 4. LOGOUT (POST /api/auth/logout)
// ==========================================
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.json({
      success: true,
      message: 'You have been safely signed out.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error during sign out.' });
  }
};

// ==========================================
// 5. UPDATE PROFILE (PUT /api/auth/profile)
// ==========================================
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { name, phone, addresses, wishlist } = req.body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (addresses) user.addresses = addresses;
    if (wishlist) user.wishlist = wishlist;
    user.updatedAt = new Date().toISOString();

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
};

// ==========================================
// 6. FORGOT PASSWORD (POST /api/auth/forgot-password)
// ==========================================
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && user.is_active !== false) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      user.reset_password_token = resetToken;
      user.reset_password_expires = resetExpires;
      await user.save();

      console.log(`🔑 [Security Event] Password reset token generated for ${user.email}: ${resetToken}`);
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been generated.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error processing password reset.' });
  }
};

// ==========================================
// 7. RESET PASSWORD (POST /api/auth/reset-password)
// ==========================================
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ success: false, message: 'Token and new password are required.' });
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      res.status(400).json({ success: false, message: PASSWORD_ERROR });
      return;
    }

    const now = new Date().toISOString();
    const user = await User.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: now }
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
      return;
    }

    user.password_hash = await hashPassword(newPassword);
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    user.updatedAt = new Date().toISOString();
    await user.save();

    res.json({
      success: true,
      message: 'Your password has been successfully reset! You may now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
};

// ==========================================
// 8. CHANGE PASSWORD (POST /api/auth/change-password)
// ==========================================
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current password and new password are required.' });
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      res.status(400).json({ success: false, message: PASSWORD_ERROR });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const hashToVerify = user.password_hash || (user as any).password || '';
    const isMatch = await verifyPassword(currentPassword, hashToVerify);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    user.password_hash = await hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully!',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error changing password.' });
  }
};
