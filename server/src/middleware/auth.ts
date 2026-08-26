import { Request, Response, NextFunction, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { memoryStore } from '../config/db';
import { UserRole } from '../types';

export const JWT_SECRET = process.env.JWT_SECRET || 'the-prime-nuts-super-secret-key-coimbatore-2026';
export const AUTH_COOKIE_NAME = 'tpn_session';

export const getAuthCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/',
});

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Extract token from HttpOnly cookie or Authorization header.
 */
const extractToken = (req: Request): string | null => {
  // 1. Primary: HttpOnly Session Cookie
  if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
    return req.cookies[AUTH_COOKIE_NAME];
  }

  // 2. Fallback: Authorization header (Bearer <token>)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    
    // Verify user exists in data store
    const user = memoryStore.users.find(u => u.id === decoded.id);
    if (!user) {
      res.status(401).json({ success: false, message: 'User session expired or user not found.' });
      return;
    }

    // Verify account is active
    if (user.is_active === false) {
      res.status(403).json({ success: false, message: 'Your account is currently unavailable. Please contact support.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Session expired or invalid. Please sign in again.' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden: Admin privileges required.' });
    return;
  }
  next();
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    const user = memoryStore.users.find(u => u.id === decoded.id);
    if (user && user.is_active !== false) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    }
  } catch {
    // Optional, continue as guest
  }
  next();
};
