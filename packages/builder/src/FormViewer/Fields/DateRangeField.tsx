import React from 'react';
import { BaseFieldProps } from './types';

interface DateRangeFieldProps extends BaseFieldProps {
  startLabel?: string;
  endLabel?: string;
  minDate?: string;
  maxDate?: string;
}

export const DateRangeField: React.FC<DateRangeFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value,
  error,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  minDate,
  maxDate,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;
  const rangeValue = typeof value === 'object' && value !== null ? value : { start: '', end: '' };

  const handleStartChange = (startDate: string) => {
    onChange?.({ ...rangeValue, start: startDate });
  };

  const handleEndChange = (endDate: string) => {
    onChange?.({ ...rangeValue, end: endDate });
  };

  return (
    <div className="form-field form-field-daterange">
      {label && (
        <div className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </div>
      )}
      <div className="form-field-daterange-wrapper">
        <div className="form-field-daterange-input">
          <label htmlFor={`${fieldId}-start`} className="form-field-daterange-label">
            {startLabel}
          </label>
          <input
            id={`${fieldId}-start`}
            name={`${name}_start`}
            type="date"
            className={`form-field-input ${error ? 'has-error' : ''}`}
            required={required}
            disabled={disabled}
            readOnly={readonly}
            value={rangeValue.start || ''}
            min={minDate}
            max={rangeValue.end || maxDate}
            onChange={(e) => handleStartChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          />
        </div>
        <div className="form-field-daterange-input">
          <label htmlFor={`${fieldId}-end`} className="form-field-daterange-label">
            {endLabel}
          </label>
          <input
            id={`${fieldId}-end`}
            name={`${name}_end`}
            type="date"
            className={`form-field-input ${error ? 'has-error' : ''}`}
            required={required}
            disabled={disabled}
            readOnly={readonly}
            value={rangeValue.end || ''}
            min={rangeValue.start || minDate}
            max={maxDate}
            onChange={(e) => handleEndChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={!!error}
          />
        </div>
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
