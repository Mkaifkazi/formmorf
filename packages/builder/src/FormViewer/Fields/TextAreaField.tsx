import React from 'react';
import { BaseFieldProps } from './types';

interface TextAreaFieldProps extends BaseFieldProps {
  rows?: number;
  cols?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
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
  rows = 3,
  cols,
  maxLength,
  resize = 'vertical',
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;

  return (
    <div className="form-field form-field-textarea">
      {label && (
        <label htmlFor={fieldId} className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <textarea
        id={fieldId}
        name={name}
        className={`form-field-textarea-input ${error ? 'has-error' : ''}`}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        value={value || ''}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        style={{ resize }}
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