import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Store } from 'lucide-react';
import { Button } from '../common/Button';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'customer' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading state
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFF7E8]">
        <div className="w-12 h-12 border-4 border-[#F28C00] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2B160D]/70 font-sans">
          Verifying Security Credentials...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated: Redirect to login with intended destination preserved
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Unauthorized: Customer trying to access Admin portal
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-[#FFF7E8] py-16 px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-3xl border border-[#E5D5B5] shadow-xl flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#2B160D] mb-2">
              Access Restricted
            </h1>
            <p className="text-xs text-[#2B160D]/70 leading-relaxed">
              This section is reserved exclusively for The Prime Nuts Store Administrators. Your current account ({user?.email}) does not have administrative privileges.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => window.history.back()}
              className="w-full"
            >
              Go Back
            </Button>
            <Button
              variant="gold"
              size="md"
              leftIcon={<Store className="w-4 h-4" />}
              onClick={() => (window.location.href = '/')}
              className="w-full"
            >
              Return Home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 4. Authorized
  return children ? <>{children}</> : null;
};
