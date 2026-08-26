import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { BrandLogo } from '../components/common/BrandLogo';

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { forgotPassword, resetPassword, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
  }, [token]);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    const res = await forgotPassword(email);
    if (res.success) {
      setSubmitted(true);
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please fill in both password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!token) {
      setErrorMsg('Missing password reset token. Please request a new link.');
      return;
    }

    const res = await resetPassword(token, newPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF7E8] py-12 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center selection:bg-[#F28C00] selection:text-[#2B160D]">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-[#E5D5B5]">
        <div className="text-center space-y-3 mb-8">
          <BrandLogo size="md" isLink={true} className="justify-center" />
          <div className="w-12 h-12 bg-[#F28C00]/15 rounded-full flex items-center justify-center mx-auto text-[#D96500] mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B160D]">
            {token ? 'Reset Your Password' : 'Forgot Your Password?'}
          </h1>
          <p className="text-xs sm:text-sm text-[#2B160D]/70 max-w-sm mx-auto">
            {token
              ? 'Create a new, strong password to secure your account.'
              : 'Enter your account email and we will send you secure password reset instructions.'}
          </p>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium mb-6"
          >
            {errorMsg}
          </motion.div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium mb-6 flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successMsg}</p>
          </motion.div>
        )}

        {!token ? (
          /* Step 1: Request Reset */
          !submitted ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#2B160D] uppercase tracking-wider">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B160D]/40" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF7E8]/50 border border-[#E5D5B5] focus:border-[#D96500] focus:bg-white rounded-xl text-sm text-[#2B160D] placeholder-[#2B160D]/40 outline-none transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full bg-[#D96500] hover:bg-[#F28C00] text-white border-none shadow-lg shadow-[#D96500]/25 font-bold"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Reset Instructions
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSubmitted(false)}
                className="w-full"
              >
                Send to a Different Email
              </Button>
            </div>
          )
        ) : (
          /* Step 2: Set New Password */
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2B160D] uppercase tracking-wider">
                New Password (Min 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B160D]/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-[#FFF7E8]/50 border border-[#E5D5B5] focus:border-[#D96500] focus:bg-white rounded-xl text-sm text-[#2B160D] placeholder-[#2B160D]/40 outline-none transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2B160D]/40 hover:text-[#2B160D] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2B160D] uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B160D]/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF7E8]/50 border border-[#E5D5B5] focus:border-[#D96500] focus:bg-white rounded-xl text-sm text-[#2B160D] placeholder-[#2B160D]/40 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full bg-[#D96500] hover:bg-[#F28C00] text-white border-none shadow-lg shadow-[#D96500]/25 font-bold"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Update & Save Password
            </Button>
          </form>
        )}

        <div className="text-center mt-6 pt-6 border-t border-[#E5D5B5]">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#D96500] hover:text-[#F28C00]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </main>
  );
};
