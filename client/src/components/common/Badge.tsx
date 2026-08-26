import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'espresso' | 'amber' | 'sand' | 'outline' | 'festival';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'sm',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium tracking-wide uppercase rounded-full select-none';

  const variants = {
    gold: 'bg-gold-100 text-gold-800 border border-gold-300/80',
    espresso: 'bg-espresso-900 text-ivory-100 border border-espresso-700',
    amber: 'bg-amber-100 text-amber-900 border border-amber-300',
    sand: 'bg-sand-200 text-espresso-800 border border-sand-300',
    outline: 'bg-transparent text-espresso-700 border border-sand-400',
    festival: 'bg-gradient-to-r from-amber-600 to-gold-600 text-white font-semibold shadow-sm',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 font-semibold',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-medium',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
