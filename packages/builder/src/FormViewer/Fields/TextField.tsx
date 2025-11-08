import React from 'react';
import { BaseFieldProps } from './types';

interface TextFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'phone' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
}

export const TextField: React.FC<TextFieldProps> = ({
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
  type = 'text',
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;

  return (
    <div className="form-field form-field-text">
      {label && (
        <label htmlFor={fieldId} className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <input
        id={fieldId}
        name={name}
        type={type}
        className={`form-field-input ${error ? 'has-error' : ''}`}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
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