import React, { useState } from 'react';
import { useFormStore } from '../store/formStore';
import { FieldRenderer } from './FieldRenderer';
import { validateField } from '../utils/validation';

interface FormPreviewProps {
  onClose: () => void;
  onSubmit?: (data: Record<string, any>) => void;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ onClose, onSubmit }) => {
  const { schema } = useFormStore();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setSubmitted] = useState(false);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when field is changed
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    schema.fields.forEach(field => {
      if (field.name) {
        const error = validateField(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // If validation passes
    setSubmitted(true);
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Show submitted data
      console.log('Form submitted with data:', formData);
      setTimeout(() => {
        alert('Form submitted successfully!\n\nData: ' + JSON.stringify(formData, null, 2));
        onClose();
      }, 100);
    }
  };

  return (
    <div className="form-preview-overlay">
      <div className="form-preview-container">
        <div className="preview-header">
          <h2>Form Preview</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="preview-content">
          {schema.fields.length === 0 ? (
            <div className="preview-empty">
              <p>No fields added to the form yet.</p>
              <p>Add some fields to see the preview.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="preview-form">
              <div className="form-header">
                <h3>{schema.title || 'Untitled Form'}</h3>
                {schema.description && (
                  <p className="form-description">{schema.description}</p>
                )}
              </div>

              <div className="form-fields">
                {schema.fields.map(field => (
                  <div key={field.id} className="preview-field">
                    <FieldRenderer
                      field={field}
                      value={formData[field.name || '']}
                      onChange={(value) => field.name && handleFieldChange(field.name, value)}
                      error={field.name ? errors[field.name] : undefined}
                      readonly={false}
                    />
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Close Preview
                </button>
                <button type="submit" className="btn-primary">
                  Submit Form
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};