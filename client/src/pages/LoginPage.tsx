import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { BrandLogo } from '../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Intended destination
  const from = (location.state as any)?.from?.pathname || (isAdmin ? '/admin' : '/');

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success && res.user) {
      setSuccessMsg('Authentication verified. Redirecting...');
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 500);
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF7E8] py-12 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center selection:bg-[#F28C00] selection:text-[#2B160D]">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5D5B5] grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Editorial Dark Chocolate Brand Showcase (5 cols) */}
        <div className="md:col-span-5 bg-[#2B160D] text-[#FFF7E8] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-r border-[#F28C00]/20">
          {/* Background Warm Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F28C00]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#D96500]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <BrandLogo variant="light" size="md" isLink={true} />

            <div className="pt-4 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F28C00]/20 border border-[#F28C00]/40 text-[#F28C00] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Production Security</span>
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#FFF7E8] leading-tight">
                தரம் பிரீமியம்,<br />
                <span className="text-[#F28C00]">விலை மினிமம்...</span>
              </h2>
              <p className="text-[#FFF7E8]/80 text-xs sm:text-sm leading-relaxed font-sans">
                Access your account to enjoy factory-fresh California almonds, premium W240 cashews, curated wellness combos, and free delivery across Tamil Nadu.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Clean Luxury Sign In Form (7 cols) */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#2B160D]">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-[#2B160D]/70 mt-1">
                Enter your credentials to access your account & orders.
              </p>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Success Feedback */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#2B160D] uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B160D]/40" />
                  <input
                    type="email"
                    name="email"
                    id="login-email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF7E8]/50 border border-[#E5D5B5] focus:border-[#D96500] focus:bg-white rounded-xl text-sm text-[#2B160D] placeholder-[#2B160D]/40 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#2B160D] uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#D96500] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B160D]/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="login-password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-[#FFF7E8]/50 border border-[#E5D5B5] focus:border-[#D96500] focus:bg-white rounded-xl text-sm text-[#2B160D] placeholder-[#2B160D]/40 outline-none transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2B160D]/40 hover:text-[#2B160D] p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full mt-4 bg-[#D96500] hover:bg-[#F28C00] text-white border-none shadow-lg shadow-[#D96500]/25 font-bold"
                isLoading={isLoading}
                disabled={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? 'Signing In...' : 'Sign In to Your Account'}
              </Button>
            </form>

            <div className="text-center pt-3 border-t border-[#E5D5B5]/60">
              <p className="text-xs text-[#2B160D]/70">
                Don't have an account yet?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#D96500] hover:text-[#F28C00] underline ml-1"
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
