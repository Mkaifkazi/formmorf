import React, { useState } from 'react';
import { BaseFieldProps } from './types';

interface RatingFieldProps extends BaseFieldProps {
  max?: number;
  allowHalf?: boolean;
  showLabels?: boolean;
  labels?: string[];
}

export const RatingField: React.FC<RatingFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value,
  error,
  max = 5,
  allowHalf = false,
  showLabels = false,
  labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;
  const [hover, setHover] = useState<number>(0);

  const handleClick = (rating: number) => {
    if (!readonly && !disabled) {
      onChange?.(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly && !disabled) {
      setHover(rating);
    }
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  const getStarClass = (index: number) => {
    const rating = hover || Number(value) || 0;
    if (index <= rating) {
      return 'form-field-rating-star-filled';
    }
    return 'form-field-rating-star-empty';
  };

  const currentLabel = showLabels && labels[Math.ceil(Number(value)) - 1];

  return (
    <div className="form-field form-field-rating">
      {label && (
        <div className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </div>
      )}
      <div className="form-field-rating-wrapper">
        <div
          className="form-field-rating-stars"
          onMouseLeave={handleMouseLeave}
          onBlur={onBlur}
        >
          {[...Array(max)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <button
                key={index}
                type="button"
                className={`form-field-rating-star ${getStarClass(ratingValue)}`}
                onClick={() => handleClick(ratingValue)}
                onMouseEnter={() => handleMouseEnter(ratingValue)}
                disabled={disabled || readonly}
                aria-label={`Rate ${ratingValue} out of ${max}`}
              >
                ★
              </button>
            );
          })}
        </div>
        {showLabels && currentLabel && (
          <span className="form-field-rating-label">{currentLabel}</span>
        )}
      </div>
      {helpText && !error && (
        <div id={`${fieldId}-help`} className="form-field-help">
          {helpText}
        </div>
      )}
      {error && (
        <div id={`${fieldId}-error`} className="form-field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
