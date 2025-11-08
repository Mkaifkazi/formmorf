import React from 'react';
import { BaseFieldProps, Option } from './types';

interface CheckboxFieldProps extends BaseFieldProps {
  options?: Option[];
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  readonly = false,
  value = false,
  error,
  options,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;

  // Single checkbox
  if (!options || options.length === 0) {
    return (
      <div className="form-field form-field-checkbox">
        <div className="form-field-checkbox-wrapper">
          <input
            id={fieldId}
            name={name}
            type="checkbox"
            className="form-field-checkbox-input"
            required={required}
            disabled={disabled || readonly}
            checked={!!value}
            onChange={(e) => onChange?.(e.target.checked)}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          />
          <label htmlFor={fieldId} className="form-field-checkbox-label">
            {label}
            {required && <span className="required-mark">*</span>}
          </label>
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
  }

  // Multiple checkboxes
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (optionValue: string | number, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(v => v !== optionValue);
    onChange?.(newValues);
  };

  return (
    <div className="form-field form-field-checkbox-group">
      {label && (
        <div className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </div>
      )}
      <div className="form-field-checkbox-options">
        {options.map((option) => {
          const optionId = `${fieldId}-${option.value}`;
          return (
            <div key={option.value} className="form-field-checkbox-wrapper">
              <input
                id={optionId}
                name={`${name}[]`}
                type="checkbox"
                className="form-field-checkbox-input"
                disabled={disabled || readonly || option.disabled}
                checked={selectedValues.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                onBlur={onBlur}
              />
              <label htmlFor={optionId} className="form-field-checkbox-label">
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