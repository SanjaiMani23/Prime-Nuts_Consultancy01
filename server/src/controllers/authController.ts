import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { memoryStore, saveStoreToFile } from '../config/db';
import { AuthRequest, JWT_SECRET, AUTH_COOKIE_NAME, getAuthCookieOptions } from '../middleware/auth';
import { User, SafeUser } from '../types';
import { hashPassword, verifyPassword, needsRehash } from '../utils/password';

/**
 * Strips password hashes and internal security tokens from user object.
 */
const sanitizeUser = (user: User): SafeUser => {
  const {
    password: _legacyPassword,
    password_hash: _hash,
    reset_password_token: _token,
    reset_password_expires: _expires,
    ...safeUser
  } = user;
  return safeUser;
};

/**
 * Generates signed JWT session token.
 */
const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
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

    // Input Validation
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing email
    const existing = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    // Hash Password with Argon2id
    const passwordHash = await hashPassword(password);

    // Create user - Force role = 'customer' (ignoring any client-supplied role)
    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || '',
      password_hash: passwordHash,
      role: 'customer', // Strict: registration NEVER creates admin
      is_active: true,
      email_verified: false,
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };

    memoryStore.users.push(newUser);
    saveStoreToFile();

    // Issue Secure Session Cookie
    const token = generateToken(newUser);
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to The Prime Nuts.',
      user: sanitizeUser(newUser),
      token, // Also return for non-cookie fallback clients
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
    const user = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);

    // Generic error to prevent email enumeration
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Check account status
    if (user.is_active === false) {
      res.status(403).json({ success: false, message: 'Your account is currently unavailable. Please contact support.' });
      return;
    }

    const hashToVerify = user.password_hash || user.password || '';
    const isMatch = await verifyPassword(password, hashToVerify);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Transparently upgrade legacy bcrypt hash to Argon2id upon login
    if (needsRehash(hashToVerify)) {
      user.password_hash = await hashPassword(password);
      delete user.password;
    }

    // Update last login
    user.last_login_at = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    saveStoreToFile();

    // Issue Secure Session Cookie
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

    const user = memoryStore.users.find(u => u.id === req.user?.id);
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

    const userIndex = memoryStore.users.findIndex(u => u.id === req.user?.id);
    if (userIndex === -1) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { name, phone, addresses, wishlist } = req.body;
    const user = memoryStore.users[userIndex];

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (addresses) user.addresses = addresses;
    if (wishlist) user.wishlist = wishlist;
    user.updatedAt = new Date().toISOString();

    memoryStore.users[userIndex] = user;
    saveStoreToFile();

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
    const user = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (user && user.is_active !== false) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      user.reset_password_token = resetToken;
      user.reset_password_expires = resetExpires;
      saveStoreToFile();

      // Log for developer / field visit testing
      console.log(`🔑 [Security Event] Password reset token generated for ${user.email}: ${resetToken}`);
    }

    // Always return generic response to prevent email enumeration
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

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const now = new Date().toISOString();
    const user = memoryStore.users.find(
      u => u.reset_password_token === token && u.reset_password_expires && u.reset_password_expires > now
    );

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
      return;
    }

    user.password_hash = await hashPassword(newPassword);
    delete user.password;
    delete user.reset_password_token;
    delete user.reset_password_expires;
    user.updatedAt = new Date().toISOString();
    saveStoreToFile();

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

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const user = memoryStore.users.find(u => u.id === req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const hashToVerify = user.password_hash || user.password || '';
    const isMatch = await verifyPassword(currentPassword, hashToVerify);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    user.password_hash = await hashPassword(newPassword);
    delete user.password;
    user.updatedAt = new Date().toISOString();
    saveStoreToFile();

    res.json({
      success: true,
      message: 'Password changed successfully!',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error changing password.' });
  }
};
