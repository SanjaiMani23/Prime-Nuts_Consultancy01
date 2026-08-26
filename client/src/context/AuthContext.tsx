import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const toast = useToast();

  // Retrieve authenticated session from backend via HttpOnly cookies
  const refreshSession = useCallback(async () => {
    try {
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      // Clean up any legacy localStorage tokens
      localStorage.removeItem('tpn_auth_token');
      localStorage.removeItem('tpn_auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authenticated session on startup
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      setIsLoading(true);
      const res = await api.login({ email, password });
      if (res.user) {
        setUser(res.user);
        toast.gold('வணக்கம் & Welcome back!', `Signed in as ${res.user.name}`);
        closeAuthModal();
        return { success: true, user: res.user, message: res.message };
      }
      return { success: false, message: 'Login failed. Please check your credentials.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      toast.error('Sign In Failed', msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      setIsLoading(true);
      const res = await api.register({ name, email, phone, password });
      if (res.user) {
        setUser(res.user);
        toast.gold('Welcome to The Prime Nuts family!', `Hello ${res.user.name}, your account is active.`);
        closeAuthModal();
        return { success: true, user: res.user, message: res.message };
      }
      return { success: false, message: 'Registration failed. Please try again.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error('Registration Error', msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('tpn_auth_token');
      localStorage.removeItem('tpn_auth_user');
      setUser(null);
      toast.info('Signed Out', 'You have been safely signed out. Visit us again soon!');
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await api.updateProfile(userData);
      if (res.user) {
        setUser(res.user);
        toast.success('Profile Updated', 'Your details have been saved.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error('Update Failed', err.response?.data?.message || 'Could not update profile.');
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.forgotPassword(email);
      toast.info('Password Reset', res.message);
      return { success: true, message: res.message };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Could not process password reset.';
      toast.error('Error', msg);
      return { success: false, message: msg };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.resetPassword(token, newPassword);
      toast.success('Password Updated', res.message);
      return { success: true, message: res.message };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Password reset link is invalid or expired.';
      toast.error('Reset Failed', msg);
      return { success: false, message: msg };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      toast.success('Password Changed', res.message);
      return { success: true, message: res.message };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password.';
      toast.error('Error', msg);
      return { success: false, message: msg };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateUser,
        forgotPassword,
        resetPassword,
        changePassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
