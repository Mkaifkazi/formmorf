import React, { useState, useCallback, FormEvent, useMemo } from 'react';
import { FormSchema, DeviceType, DEVICE_BREAKPOINTS } from '../types';
import { FieldRenderer } from './FieldRenderer';
import { validateField, validateForm as validateFormUtil } from '../utils/validation';
import { getVisibleFields } from '../core/conditions';

export interface FormViewerProps {
  schema: FormSchema;
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  onChange?: (values: Record<string, any>) => void;
  onFieldChange?: (fieldName: string, value: any) => void;
  readonly?: boolean;
  className?: string;
  device?: DeviceType;
  showDeviceFrame?: boolean;
}

export const FormViewer: React.FC<FormViewerProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  onChange,
  onFieldChange,
  readonly = false,
  className = '',
  device,
  showDeviceFrame = false,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    const newValues = { ...values, [fieldName]: value };
    setValues(newValues);

    // Clear error when field is modified
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    // Notify parent components
    onFieldChange?.(fieldName, value);
    onChange?.(newValues);
  }, [values, errors, onFieldChange, onChange]);

  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validate field on blur
    const field = schema.fields.find(f => (f.name || f.id) === fieldName);
    if (field) {
      const error = validateField(field, values[fieldName], values);
      if (error) {
        setErrors(prev => ({ ...prev, [fieldName]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  }, [schema.fields, values]);

  const validateForm = useCallback((): boolean => {
    // Only validate visible fields
    const visibleFieldsForValidation = getVisibleFields(schema.fields, values);
    const errors = validateFormUtil(visibleFieldsForValidation, values);
    const errorMap: Record<string, string> = {};

    errors.forEach(error => {
      const field = visibleFieldsForValidation.find(f => f.id === error.fieldId);
      if (field) {
        const fieldName = field.name || field.id;
        errorMap[fieldName] = error.message;
      }
    });

    setErrors(errorMap);
    return Object.keys(errorMap).length === 0;
  }, [schema.fields, values]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (readonly || !onSubmit) return;

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    schema.fields.forEach(field => {
      const fieldName = field.name || field.id;
      allTouched[fieldName] = true;
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(values);
      setSubmitStatus('success');
      setSubmitMessage('Form submitted successfully!');

      // Clear form after successful submission (optional)
      if (schema.settings?.clearOnSubmit) {
        setValues(initialValues);
        setTouched({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  }, [readonly, onSubmit, schema.fields, schema.settings, validateForm, values, initialValues]);

  const handleReset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitStatus('idle');
    setSubmitMessage('');
  }, [initialValues]);

  // Calculate visible fields based on conditional logic
  const visibleFields = useMemo(() => {
    return getVisibleFields(schema.fields, values);
  }, [schema.fields, values]);

  if (!schema || !schema.fields || schema.fields.length === 0) {
    return (
      <div className="form-viewer-empty">
        <p>No form fields to display</p>
      </div>
    );
  }

  // Calculate device width if device prop is provided
  const deviceWidth = device ? DEVICE_BREAKPOINTS[device].width : undefined;

  const formStyle: React.CSSProperties = deviceWidth ? {
    maxWidth: `${deviceWidth}px`,
    margin: '0 auto',
    transition: 'max-width 0.3s ease',
  } : {};

  const formWrapperStyle: React.CSSProperties = showDeviceFrame && device ? {
    padding: '40px',
    background: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } : {};

  const FormContent = (
    <form
      className={`form-viewer ${className} ${device ? `device-${device}` : ''}`}
      onSubmit={handleSubmit}
      noValidate
      style={formStyle}
    >
      {/* Form Header */}
      {(schema.title || schema.description) && (
        <div className="form-viewer-header">
          {schema.title && <h2 className="form-viewer-title">{schema.title}</h2>}
          {schema.description && <p className="form-viewer-description">{schema.description}</p>}
        </div>
      )}

      {/* Form Fields */}
      <div className="form-viewer-fields">
        {visibleFields.map((field) => {
          const fieldName = field.name || field.id;
          return (
            <div key={field.id} className="form-field-wrapper">
              <FieldRenderer
                field={field}
                value={values[fieldName]}
                error={touched[fieldName] ? errors[fieldName] : undefined}
                onChange={(value) => handleFieldChange(fieldName, value)}
                onBlur={() => handleFieldBlur(fieldName)}
                readonly={readonly}
                disabled={isSubmitting}
              />
            </div>
          );
        })}
      </div>

      {/* Submission Status Messages */}
      {submitStatus !== 'idle' && (
        <div className={`form-viewer-status form-viewer-status-${submitStatus}`}>
          <div className="form-viewer-status-content">
            {submitStatus === 'success' && (
              <span className="form-viewer-status-icon">✓</span>
            )}
            {submitStatus === 'error' && (
              <span className="form-viewer-status-icon">✗</span>
            )}
            <span className="form-viewer-status-message">{submitMessage}</span>
          </div>
        </div>
      )}

      {/* Form Actions */}
      {!readonly && (
        <div className="form-viewer-footer">
          <button
            type="submit"
            className="form-viewer-button form-viewer-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : (schema.settings?.submitButtonText || 'Submit')}
          </button>
          <button
            type="button"
            className="form-viewer-button form-viewer-button-secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            {schema.settings?.cancelButtonText || 'Reset'}
          </button>
        </div>
      )}
    </form>
  );

  // Wrap in device frame if requested
  if (showDeviceFrame && device) {
    return (
      <div className="device-preview-wrapper" style={formWrapperStyle}>
        <div className={`device-frame device-frame-${device}`}>
          {FormContent}
        </div>
      </div>
    );
  }

  return FormContent;
};