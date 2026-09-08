import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const LuxuryInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-xl border bg-ivory-50 text-espresso-950 placeholder-sand-400 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 disabled:bg-sand-100 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              'py-3',
              error
                ? 'border-spice-500/80 focus:border-spice-500 focus:ring-spice-500/20'
                : 'border-sand-300/80 hover:border-sand-400 focus:border-gold-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-spice-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-charcoal-500">{helperText}</p>}
      </div>
    );
  }
);

LuxuryInput.displayName = 'LuxuryInput';
