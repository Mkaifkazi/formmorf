import React from 'react';
import { BaseFieldProps, Option } from './types';

interface SelectFieldProps extends BaseFieldProps {
  options: Option[];
  multiple?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
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
  options = [],
  multiple = false,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
      onChange?.(selectedValues);
    } else {
      onChange?.(e.target.value);
    }
  };

  return (
    <div className="form-field form-field-select">
      {label && (
        <label htmlFor={fieldId} className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <select
        id={fieldId}
        name={name}
        className={`form-field-select-input ${error ? 'has-error' : ''}`}
        required={required}
        disabled={disabled || readonly}
        value={value}
        multiple={multiple}
        onChange={handleChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
      >
        {!multiple && placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
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