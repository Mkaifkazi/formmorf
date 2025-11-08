import React from 'react';
import { FieldDefinition } from '../types';

// Import field components
import {
  TextField,
  SelectField,
  CheckboxField,
  RadioField,
  TextAreaField,
  NumberField,
  SwitchField,
  RangeField,
  RatingField,
  FileField,
  ColorField,
  TimeField,
  DateTimeField,
  DateRangeField,
  RichTextField,
  SectionField,
  AlertField
} from './Fields';

interface FieldRendererProps {
  field: FieldDefinition;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
  readonly?: boolean;
  disabled?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  error,
  onChange,
  onBlur,
  readonly = false,
  disabled = false,
}) => {
  const commonProps = {
    id: field.id,
    name: field.name || field.id,  // Ensure name is always defined
    label: field.label,
    placeholder: field.placeholder,
    helpText: field.helpText,
    required: field.required,
    disabled: disabled || field.disabled,
    readonly: readonly || (field as any).readonly,  // Type assertion for readonly
    value,
    error,
    onChange,
    onBlur,
  };

  // Render based on field type
  switch (field.type) {
    // Text-based inputs
    case 'text':
    case 'email':
    case 'password':
    case 'phone':
    case 'url':
    case 'search':
      return <TextField {...commonProps} type={field.type} />;

    case 'textarea':
      return <TextAreaField {...commonProps} rows={(field as any).rows || 3} />;

    case 'richtext':
      return (
        <RichTextField
          {...commonProps}
          minHeight={(field as any).minHeight}
          maxHeight={(field as any).maxHeight}
        />
      );

    case 'number':
      return (
        <NumberField
          {...commonProps}
          min={(field as any).min}
          max={(field as any).max}
          step={(field as any).step}
        />
      );

    // Choice inputs
    case 'select':
      return (
        <SelectField
          {...commonProps}
          options={(field as any).options || []}
          multiple={(field as any).multiple}
        />
      );

    case 'checkbox':
      return (
        <CheckboxField
          {...commonProps}
          options={(field as any).options}
        />
      );

    case 'radio':
      return (
        <RadioField
          {...commonProps}
          options={(field as any).options || []}
        />
      );

    case 'switch':
      return <SwitchField {...commonProps} />;

    case 'rating':
      return (
        <RatingField
          {...commonProps}
          max={(field as any).max || 5}
          showLabels={(field as any).showLabels}
        />
      );

    case 'range':
      return (
        <RangeField
          {...commonProps}
          min={(field as any).min || 0}
          max={(field as any).max || 100}
          step={(field as any).step || 1}
          showValue={(field as any).showValue !== false}
          showLabels={(field as any).showLabels !== false}
        />
      );

    // Date & Time
    case 'date':
      return (
        <TextField
          {...commonProps}
          type="date"
        />
      );

    case 'time':
      return (
        <TimeField
          {...commonProps}
          format={(field as any).format || '24'}
          step={(field as any).step}
        />
      );

    case 'datetime':
      return (
        <DateTimeField
          {...commonProps}
          format={(field as any).format || '24'}
          minDate={(field as any).minDate}
          maxDate={(field as any).maxDate}
        />
      );

    case 'daterange':
      return (
        <DateRangeField
          {...commonProps}
          startLabel={(field as any).startLabel}
          endLabel={(field as any).endLabel}
          minDate={(field as any).minDate}
          maxDate={(field as any).maxDate}
        />
      );

    // Rich Inputs
    case 'color':
      return <ColorField {...commonProps} />;

    case 'file':
    case 'image':
      return (
        <FileField
          {...commonProps}
          accept={(field.type === 'image' ? 'image/*' : (field as any).accept)}
          multiple={(field as any).multiple}
          maxSize={(field as any).maxSize}
        />
      );

    // Layout elements (non-input)
    case 'section':
      return (
        <SectionField
          title={field.label || (field as any).title}
          description={(field as any).description}
          collapsible={(field as any).collapsible}
          defaultExpanded={(field as any).defaultExpanded !== false}
        />
      );

    case 'alert':
      return (
        <AlertField
          title={field.label || (field as any).title}
          message={(field as any).content || (field as any).message}
          type={(field as any).alertType || 'info'}
          dismissible={(field as any).dismissible}
        />
      );

    case 'header':
      return (
        <div className="field-header">
          <h3>{field.label || (field as any).content}</h3>
        </div>
      );

    case 'paragraph':
      return (
        <div className="field-paragraph">
          <p>{(field as any).content || field.label}</p>
        </div>
      );

    case 'divider':
      return <hr className="field-divider" />;

    // Fallback for unsupported types
    default:
      return (
        <div className="field-unsupported">
          <p>Unsupported field type: {field.type}</p>
        </div>
      );
  }
};
