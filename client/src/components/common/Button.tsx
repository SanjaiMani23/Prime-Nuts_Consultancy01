import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const variants = {
    // Dark Chocolate Primary (Secondary button on hero: EXPLORE COMBOS)
    primary: 'bg-[#2B160D] text-[#FFFCF6] hover:bg-[#3A1D12] border border-[#3A1F13] shadow-md hover:shadow-lg focus:ring-[#F28C00]',
    // Saffron Orange Luxury CTA (Primary button on hero: SHOP NOW)
    gold: 'bg-[#F28C00] text-[#2B160D] hover:bg-[#D96500] hover:text-[#2B160D] shadow-md shadow-[#F28C00]/20 hover:shadow-lg focus:ring-[#F28C00] border border-[#FAA93D]',
    // Soft Cream Secondary
    secondary: 'bg-[#FFF7E8] text-[#2B160D] hover:bg-[#FEEDD3] border border-[#D8A15D] shadow-sm focus:ring-[#2B160D]',
    // Neutral / Cream Outline (WhatsApp & Outline CTAs)
    outline: 'bg-[#FFFCF6] text-[#2B160D] border border-[#D8A15D] hover:border-[#D96500] hover:text-[#D96500] hover:bg-[#FEEDD3] focus:ring-[#F28C00]',
    // Ghost
    ghost: 'bg-transparent text-[#2B160D] hover:bg-[#FFF7E8] hover:text-[#D96500] focus:ring-[#F28C00]',
    // WhatsApp Express
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-md shadow-[#25D366]/30 focus:ring-[#25D366]',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
    xl: 'text-lg px-8 py-4 gap-3 font-semibold tracking-wide',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
