import React from 'react';
import { BaseFieldProps } from './types';

export const SwitchField: React.FC<BaseFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value = false,
  error,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!readonly) {
      onChange?.(e.target.checked);
    }
  };

  return (
    <div className="form-field form-field-switch">
      <div className="form-field-switch-wrapper">
        <label className="form-field-switch-container">
          <input
            id={fieldId}
            name={name}
            type="checkbox"
            className="form-field-switch-input"
            required={required}
            disabled={disabled || readonly}
            checked={!!value}
            onChange={handleChange}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          />
          <span className="form-field-switch-slider"></span>
        </label>
        {label && (
          <span className="form-field-switch-label">
            {label}
            {required && <span className="required-mark">*</span>}
          </span>
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