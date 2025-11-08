import React from 'react';
import { FieldComponentProps } from '../types';
import { IconRenderer } from './IconRenderer';

export const FieldRenderer: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  error,
  readonly = false,
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'phone':
      case 'url':
      case 'search':
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={value || field.defaultValue}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={readonly || field.disabled}
            required={field.required}
            className="field-input"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={value || field.defaultValue}
            onChange={(e) => onChange?.(e.target.valueAsNumber)}
            disabled={readonly || field.disabled}
            required={field.required}
            min={'min' in field ? field.min : undefined}
            max={'max' in field ? field.max : undefined}
            step={'step' in field ? field.step : undefined}
            className="field-input"
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={value || field.defaultValue}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={readonly || field.disabled}
            required={field.required}
            rows={4}
            className="field-textarea"
          />
        );

      case 'select':
        if ('options' in field) {
          return (
            <select
              id={field.id}
              name={field.name}
              defaultValue={value || field.defaultValue}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={readonly || field.disabled}
              required={field.required}
              className="field-select"
            >
              <option value="">{field.placeholder || 'Select...'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }
        break;

      case 'checkbox':
        if ('options' in field && field.options) {
          return (
            <div className="field-checkbox-group">
              {field.options.map((option) => (
                <label key={option.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={option.value}
                    disabled={readonly || field.disabled}
                    className="field-checkbox"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          );
        } else {
          return (
            <label className="checkbox-label">
              <input
                type="checkbox"
                id={field.id}
                name={field.name}
                disabled={readonly || field.disabled}
                className="field-checkbox"
              />
              <span>{field.label}</span>
            </label>
          );
        }

      case 'radio':
        if ('options' in field && field.options) {
          return (
            <div className="field-radio-group">
              {field.options.map((option) => (
                <label key={option.value} className="radio-label">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    disabled={readonly || field.disabled}
                    className="field-radio"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          );
        }
        break;

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            name={field.name}
            defaultValue={value || field.defaultValue}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={readonly || field.disabled}
            required={field.required}
            className="field-input"
          />
        );

      case 'time':
        return (
          <input
            type="time"
            id={field.id}
            name={field.name}
            defaultValue={value || field.defaultValue}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={readonly || field.disabled}
            required={field.required}
            className="field-input"
          />
        );

      case 'file':
      case 'image':
        return (
          <input
            type="file"
            id={field.id}
            name={field.name}
            accept={'accept' in field ? field.accept : (field.type === 'image' ? 'image/*' : undefined)}
            multiple={'multiple' in field ? field.multiple : false}
            disabled={readonly || field.disabled}
            required={field.required}
            className="field-file"
          />
        );

      case 'datetime':
        return (
          <input
            type="datetime-local"
            id={field.id}
            name={field.name}
            defaultValue={value || field.defaultValue}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={readonly || field.disabled}
            required={field.required}
            className="field-input"
          />
        );

      case 'range':
        return (
          <div className="field-range-wrapper">
            <input
              type="range"
              id={field.id}
              name={field.name}
              defaultValue={value ?? field.defaultValue ?? ('min' in field ? field.min : 0)}
              onChange={(e) => onChange?.(e.target.valueAsNumber)}
              disabled={readonly || field.disabled}
              min={'min' in field ? field.min : 0}
              max={'max' in field ? field.max : 100}
              step={'step' in field ? field.step : 1}
              className="field-range"
            />
            {'showValue' in field && field.showValue && (
              <span className="range-value">{value ?? field.defaultValue ?? ('min' in field ? field.min : 0)}</span>
            )}
          </div>
        );

      case 'color':
        return (
          <input
            type="color"
            id={field.id}
            name={field.name}
            defaultValue={value || field.defaultValue || '#000000'}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={readonly || field.disabled}
            className="field-color"
          />
        );

      case 'switch':
        return (
          <label className="field-switch">
            <input
              type="checkbox"
              id={field.id}
              name={field.name}
              defaultChecked={value || field.defaultValue}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={readonly || field.disabled}
              className="switch-input"
            />
            <span className="switch-slider"></span>
            {'onLabel' in field && field.onLabel && (
              <span className="switch-label">
                {value ? field.onLabel : ('offLabel' in field ? field.offLabel : '')}
              </span>
            )}
          </label>
        );

      case 'rating':
        const maxRating = 'maxRating' in field ? field.maxRating : 5;
        const currentRating = value;
        return (
          <div className="field-rating">
            {[...Array(maxRating)].map((_, index) => (
              <button
                key={index}
                type="button"
                className={`rating-star ${index < currentRating ? 'filled' : ''}`}
                onClick={() => !readonly && onChange?.(index + 1)}
                disabled={readonly || field.disabled}
              >
                <IconRenderer icon={'icon' in field && field.icon ? field.icon : 'star'} size="small" />
              </button>
            ))}
          </div>
        );

      case 'daterange':
        return (
          <div className="field-daterange">
            <div className="daterange-input">
              <label>{'startLabel' in field ? field.startLabel : 'Start Date'}</label>
              <input
                type="date"
                name={`${field.name}_start`}
                disabled={readonly || field.disabled}
                min={'minDate' in field ? field.minDate : undefined}
                max={'maxDate' in field ? field.maxDate : undefined}
                className="field-input"
              />
            </div>
            <div className="daterange-input">
              <label>{'endLabel' in field ? field.endLabel : 'End Date'}</label>
              <input
                type="date"
                name={`${field.name}_end`}
                disabled={readonly || field.disabled}
                min={'minDate' in field ? field.minDate : undefined}
                max={'maxDate' in field ? field.maxDate : undefined}
                className="field-input"
              />
            </div>
          </div>
        );

      case 'richtext':
        return (
          <div className="field-richtext">
            <div className="richtext-toolbar">
              {'toolbar' in field && field.toolbar ? field.toolbar.map(tool => (
                <button key={tool} className="toolbar-btn" type="button">
                  {tool}
                </button>
              )) : null}
            </div>
            <div
              contentEditable={!readonly && !field.disabled}
              className="richtext-editor"
              onInput={(e) => onChange?.(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: value || field.defaultValue || '' }}
            />
          </div>
        );

      case 'signature':
        return (
          <div className="field-signature">
            <canvas
              className="signature-canvas"
              width={300}
              height={150}
              style={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}
            />
            <button type="button" className="signature-clear">Clear</button>
          </div>
        );

      case 'section':
        return (
          <details className="field-section" open={'collapsed' in field ? !field.collapsed : true}>
            <summary className="section-header">
              {'title' in field ? field.title : 'Section'}
            </summary>
            <div className="section-content">
              {'fields' in field && field.fields ? (
                field.fields.map((subfield: any) => (
                  <FieldRenderer
                    key={subfield.id}
                    field={subfield}
                    value={value?.[subfield.name]}
                    onChange={(val) => onChange?.({ ...value, [subfield.name]: val })}
                    readonly={readonly}
                  />
                ))
              ) : null}
            </div>
          </details>
        );

      case 'alert':
        const alertType = 'alertType' in field ? field.alertType : 'info';
        return (
          <div className={`field-alert alert-${alertType}`}>
            {'content' in field ? field.content : 'Alert message'}
          </div>
        );

      case 'header':
        const HeadingTag = `h${'level' in field ? field.level : 2}` as keyof JSX.IntrinsicElements;
        return <HeadingTag className="field-header">{'content' in field ? field.content : 'Header'}</HeadingTag>;

      case 'paragraph':
        return <p className="field-paragraph">{'content' in field ? field.content : ''}</p>;

      case 'divider':
        return <hr className="field-divider" />;

      default:
        return <div className="field-unsupported">Field type "{(field as any).type}" is not yet supported</div>;
    }
  };

  return (
    <div className={`field-wrapper ${field.type}`} style={{ width: field.style?.width }}>
      {field.label && field.type !== 'header' && field.type !== 'paragraph' && field.type !== 'divider' && (
        <label htmlFor={field.id} className="field-label">
          {field.label}
          {field.required && <span className="required-mark">*</span>}
        </label>
      )}

      {renderField()}

      {field.helpText && (
        <small className="field-help">{field.helpText}</small>
      )}

      {error && (
        <span className="field-error">{error}</span>
      )}
    </div>
  );
};
