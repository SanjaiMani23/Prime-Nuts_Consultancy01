import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Sparkles, ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { LuxuryInput } from '../common/LuxuryInput';
import { BrandLogo } from '../common/BrandLogo';

export const SplitScreenAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    forgotPassword,
    isLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';
  const isForgot = authModalMode === 'forgot';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isForgot) {
      if (!email) {
        setErrorMsg('Please enter your email address.');
        return;
      }
      const res = await forgotPassword(email);
      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
      return;
    }

    if (isLogin) {
      if (!email || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } else {
      if (!name || !email || !password) {
        setErrorMsg('Name, email, and password are required.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      const res = await register(name, email, phone, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto selection:bg-[#F28C00] selection:text-[#2B160D]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#2B160D]/80 backdrop-blur-md"
        />

        {/* Split Screen Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 border border-[#E5D5B5] my-8"
        >
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-ivory-100/80 hover:bg-[#FFF7E8] text-[#2B160D]/70 hover:text-[#2B160D] flex items-center justify-center transition-colors shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Side: Dark Luxury Editorial Brand Panel (5 Cols) */}
          <div className="md:col-span-5 bg-[#2B160D] text-[#FFF7E8] p-8 flex flex-col justify-between relative overflow-hidden border-r border-[#F28C00]/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#F28C00]/15 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#D96500]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <BrandLogo variant="light" size="md" isLink={false} />

              <div className="pt-6 space-y-4">
                <h3 className="font-sans text-2xl font-extrabold text-[#FFF7E8] leading-tight">
                  “தரம் பிரீமியம், விலை மினிமம்!”
                </h3>
                <p className="text-[#FFF7E8]/80 text-xs leading-relaxed font-sans">
                  Join The Prime Nuts family to enjoy handpicked California almonds, jumbo cashews, Afghan figs, super seeds, and free shipping across Tamil Nadu.
                </p>
              </div>
            </div>

          </div>

          {/* Right Side: Clean Luxury Form (7 Cols) */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto space-y-6">
              {/* Header */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B160D]">
                  {isForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create an Account'}
                </h3>
                <p className="text-xs sm:text-sm text-[#2B160D]/70 mt-1">
                  {isForgot
                    ? 'Enter your email to receive password reset instructions.'
                    : isLogin
                    ? 'Enter your credentials to access orders & saved addresses.'
                    : 'Sign up for exclusive festive offers and express checkout.'}
                </p>
              </div>

              {/* Error Box */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Success Box */}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
                  {successMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && !isForgot && (
                  <LuxuryInput
                    label="Full Name"
                    type="text"
                    placeholder="e.g. Anand Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                    required
                  />
                )}

                <LuxuryInput
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                {!isLogin && !isForgot && (
                  <LuxuryInput
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                )}

                {!isForgot && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#2B160D] uppercase tracking-wider">
                        Password
                      </label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMsg('');
                            setSuccessMsg('');
                            openAuthModal('forgot');
                          }}
                          className="text-xs font-semibold text-[#D96500] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <LuxuryInput
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      leftIcon={<Lock className="w-4 h-4" />}
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full mt-2 bg-[#D96500] hover:bg-[#F28C00] text-white border-none shadow-lg shadow-[#D96500]/25 font-bold"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isForgot ? 'Send Reset Link' : isLogin ? 'Sign In to Your Account' : 'Complete Registration'}
                </Button>
              </form>

              {/* Switch Modes */}
              <div className="text-center pt-2 border-t border-[#E5D5B5]/60">
                {isForgot ? (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setSuccessMsg('');
                      openAuthModal('login');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#D96500] hover:underline"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to Sign In
                  </button>
                ) : isLogin ? (
                  <p className="text-xs text-[#2B160D]/70">
                    Don’t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setSuccessMsg('');
                        openAuthModal('register');
                      }}
                      className="font-bold text-[#D96500] hover:text-[#F28C00] underline ml-1"
                    >
                      Sign Up Now
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-[#2B160D]/70">
                    Already registered with us?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setSuccessMsg('');
                        openAuthModal('login');
                      }}
                      className="font-bold text-[#D96500] hover:text-[#F28C00] underline ml-1"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
