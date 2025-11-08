import React from 'react';
import { BaseFieldProps } from './types';

interface RangeFieldProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  showLabels?: boolean;
}

export const RangeField: React.FC<RangeFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value,
  error,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  showLabels = true,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;
  const currentValue = value ?? min;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange?.(val);
  };

  const percentage = ((Number(currentValue) - min) / (max - min)) * 100;

  return (
    <div className="form-field form-field-range">
      {label && (
        <label htmlFor={fieldId} className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div className="form-field-range-wrapper">
        {showLabels && (
          <span className="form-field-range-label-min">{min}</span>
        )}
        <div className="form-field-range-container">
          <input
            id={fieldId}
            name={name}
            type="range"
            className="form-field-range-input"
            required={required}
            disabled={disabled || readonly}
            value={currentValue}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            }}
          />
          {showValue && (
            <div className="form-field-range-value">{currentValue}</div>
          )}
        </div>
        {showLabels && (
          <span className="form-field-range-label-max">{max}</span>
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
