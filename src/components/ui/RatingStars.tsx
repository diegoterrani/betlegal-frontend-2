import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number; // 1 to 5
  max?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  ariaLabel?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
  showText = true,
  ariaLabel,
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  }[size];

  const handleKeyDown = (e: React.KeyboardEvent, starIdx: number) => {
    if (!interactive || !onChange) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(max, value + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(1, value - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(starIdx);
    }
  };

  return (
    <div
      className="inline-flex items-center gap-1.5"
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={ariaLabel || `Avaliação: ${value} de ${max}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const starVal = i + 1;
          const isFilled = starVal <= Math.round(value);

          if (interactive) {
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={value === starVal}
                aria-label={`${starVal} de ${max} estrelas`}
                onClick={() => onChange && onChange(starVal)}
                onKeyDown={(e) => handleKeyDown(e, starVal)}
                className="p-1 text-[#667085] hover:text-[#EAA914] focus-visible:ring-2 focus-visible:ring-[#1769E0] rounded transition-transform active:scale-95"
              >
                <Star
                  className={`${sizeClasses} ${
                    isFilled ? 'text-[#EAA914] fill-[#EAA914]' : 'text-[#D7DEE8]'
                  }`}
                />
              </button>
            );
          }

          return (
            <Star
              key={i}
              className={`${sizeClasses} ${
                isFilled ? 'text-[#EAA914] fill-[#EAA914]' : 'text-[#D7DEE8]'
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {showText && (
        <span className="font-mono text-xs font-semibold text-[#263648] ml-1">
          {value.toFixed(1)} <span className="text-[#667085] font-normal font-sans">/ 5</span>
        </span>
      )}
    </div>
  );
};
