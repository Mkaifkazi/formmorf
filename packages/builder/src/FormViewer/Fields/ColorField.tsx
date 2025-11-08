import React from 'react';
import { BaseFieldProps } from './types';

export const ColorField: React.FC<BaseFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value = '#000000',
  error,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="form-field form-field-color">
      {label && (
        <label htmlFor={fieldId} className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div className="form-field-color-wrapper">
        <input
          id={fieldId}
          name={name}
          type="color"
          className="form-field-color-input"
          required={required}
          disabled={disabled || readonly}
          value={value || '#000000'}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
        />
        <span className="form-field-color-value">{value}</span>
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