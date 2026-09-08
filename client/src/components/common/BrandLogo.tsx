import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'full';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  isLink?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  className = '',
  isLink = true,
}) => {
  const isLightText = variant === 'light';

  const sizeClasses = {
    sm: {
      img: 'h-7 sm:h-8 w-auto',
      title: 'text-base sm:text-lg',
      subtitle: 'text-[8px] sm:text-[9px]',
    },
    md: {
      img: 'h-[36px] sm:h-[40px] md:h-[44px] w-auto',
      title: 'text-lg sm:text-xl',
      subtitle: 'text-[9px] sm:text-[10px]',
    },
    lg: {
      img: 'h-11 sm:h-12 w-auto',
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-[10px] sm:text-xs',
    },
  };

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Official Shield & Emblem Mark */}
      <img
        src="/images/logo/official_logo.png"
        alt="The Prime Nuts Logo"
        className={`${sizeClasses[size].img} shrink-0 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300`}
        loading="eager"
      />

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col">
        <span
          className={`font-serif ${sizeClasses[size].title} font-bold tracking-tight leading-none ${
            isLightText
              ? 'text-ivory-50 group-hover:text-gold-300'
              : 'text-espresso-950 group-hover:text-gold-700'
          } transition-colors`}
        >
          The Prime Nuts
        </span>
        {showSubtitle && (
          <span
            className={`font-sans ${sizeClasses[size].subtitle} font-bold tracking-widest uppercase mt-0.5 sm:mt-1 ${
              isLightText ? 'text-gold-400' : 'text-gold-800'
            }`}
          >
            Sundarapuram • Coimbatore
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" aria-label="The Prime Nuts Home">
        {content}
      </Link>
    );
  }

  return content;
};

