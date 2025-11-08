import React from 'react';
import { BaseFieldProps, Option } from './types';

interface RadioFieldProps extends BaseFieldProps {
  options: Option[];
}

export const RadioField: React.FC<RadioFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value = '',
  error,
  options = [],
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;

  return (
    <div className="form-field form-field-radio">
      {label && (
        <div className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </div>
      )}
      <div className="form-field-radio-options">
        {options.map((option) => {
          const optionId = `${fieldId}-${option.value}`;
          return (
            <div key={option.value} className="form-field-radio-wrapper">
              <input
                id={optionId}
                name={name}
                type="radio"
                className="form-field-radio-input"
                disabled={disabled || readonly || option.disabled}
                checked={value === option.value}
                onChange={() => onChange?.(option.value)}
                onBlur={onBlur}
                aria-invalid={!!error}
              />
              <label htmlFor={optionId} className="form-field-radio-label">
                {option.label}
              </label>
            </div>
          );
        })}
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