import React, { useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const maxW = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative w-full ${maxW[maxWidth]} bg-ivory-50 border border-sand-300/80 rounded-2xl shadow-2xl overflow-hidden z-10 my-8`}
          >
            {/* Header */}
            {(title || subtitle) && (
              <div className="px-6 py-5 border-b border-sand-200 flex items-center justify-between bg-sand-50/70">
                <div>
                  {title && <h3 className="font-sans text-xl font-bold text-espresso-950">{title}</h3>}
                  {subtitle && <p className="text-xs text-charcoal-600 mt-0.5">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-charcoal-500 hover:text-espresso-950 hover:bg-sand-200/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full text-charcoal-500 hover:text-espresso-950 bg-ivory-100/90 hover:bg-sand-200 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
