import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'gold';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  gold: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'gold', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => showToast(title, message, 'success'), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast(title, message, 'error'), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast(title, message, 'info'), [showToast]);
  const gold = useCallback((title: string, message?: string) => showToast(title, message, 'gold'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, gold }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto bg-espresso-900 border border-gold-400/40 text-ivory-100 rounded-xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-md"
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-gold-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-spice-500" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-sand-300" />}
                {toast.type === 'gold' && <span className="text-gold-400 text-lg">✨</span>}
              </div>
              <div className="flex-1 text-sm">
                <p className="font-semibold text-ivory-50">{toast.title}</p>
                {toast.message && <p className="text-sand-300/90 text-xs mt-0.5 leading-relaxed">{toast.message}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-sand-400 hover:text-ivory-100 transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
