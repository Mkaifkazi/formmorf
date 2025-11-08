import React from 'react';
import { BaseFieldProps } from './types';

interface NumberFieldProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  name,
  label,
  placeholder,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value = '',
  error,
  min,
  max,
  step = 1,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange?.('');
    } else {
      const numVal = parseFloat(val);
      if (!isNaN(numVal)) {
        onChange?.(numVal);
      }
    }
  };

  return (
    <div className="form-field form-field-number">
      {label && (
        <label htmlFor={fieldId} className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <input
        id={fieldId}
        name={name}
        type="number"
        className={`form-field-input ${error ? 'has-error' : ''}`}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
      />
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