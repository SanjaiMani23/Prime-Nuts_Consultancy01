import React from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  reviewCount?: number;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 'sm',
  showScore = true,
  reviewCount,
  className,
}) => {
  // If no reviews or zero rating, do not display fake stars or ratings
  if (!rating || rating <= 0 || (reviewCount !== undefined && reviewCount === 0)) {
    return null;
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={clsx('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5 text-gold-500">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={clsx(
                iconSizes[size],
                filled ? 'fill-gold-500 text-gold-500' : half ? 'fill-gold-300 text-gold-500' : 'text-sand-300'
              )}
            />
          );
        })}
      </div>
      {showScore && (
        <span className={clsx('font-semibold text-espresso-900', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className={clsx('text-charcoal-600', textSizes[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
