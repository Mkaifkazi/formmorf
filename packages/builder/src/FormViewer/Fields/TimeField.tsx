import React, { useState, useRef, useEffect } from 'react';
import { BaseFieldProps } from './types';

interface TimeFieldProps extends BaseFieldProps {
  format?: '12' | '24';
  step?: number;
}

export const TimeField: React.FC<TimeFieldProps> = ({
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
  format = '24',
  step = 60,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;
  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | undefined>(undefined);
  const [selectedMinute, setSelectedMinute] = useState<number | undefined>(undefined);
  const [isPM, setIsPM] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Parse the value when it changes
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.toString().split(':').map(Number);
      if (format === '12') {
        setIsPM(hours >= 12);
        setSelectedHour(hours > 12 ? hours - 12 : hours === 0 ? 12 : hours);
      } else {
        setSelectedHour(hours);
      }
      setSelectedMinute(minutes || 0);
    }
  }, [value, format]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const formatDisplayTime = () => {
    if (!value) return '';
    const [hours, minutes] = value.toString().split(':').map(Number);
    if (format === '12') {
      const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleTimeSelect = () => {
    let hours = selectedHour;
    if (hours === undefined || selectedMinute === undefined) return;

    if (format === '12') {
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    }
    const timeString = `${hours.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onChange?.(timeString);
    setShowPicker(false);
  };

  const hours = format === '12'
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);

  const minutes = Array.from({ length: 60 / (step / 60) }, (_, i) => i * (step / 60));

  return (
    <div className="form-field form-field-time">
      {label && (
        <label htmlFor={fieldId} className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div className="time-input-wrapper" style={{ position: 'relative' }}>
        <input
          id={fieldId}
          name={name}
          type="text"
          className={`form-field-input ${error ? 'has-error' : ''}`}
          placeholder={placeholder || (format === '12' ? 'hh:mm AM/PM' : 'HH:mm')}
          required={required}
          disabled={disabled}
          readOnly
          value={formatDisplayTime()}
          onClick={() => !disabled && !readonly && setShowPicker(true)}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          style={{ cursor: disabled || readonly ? 'default' : 'pointer' }}
        />
        {showPicker && !disabled && !readonly && (
          <div
            ref={pickerRef}
            className="time-picker-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1000,
              display: 'flex',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>Hour</label>
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minWidth: '60px'
                }}
              >
                {hours.map(h => (
                  <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>Minute</label>
              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(Number(e.target.value))}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minWidth: '60px'
                }}
              >
                {minutes.map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            {format === '12' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>Period</label>
                <select
                  value={isPM ? 'PM' : 'AM'}
                  onChange={(e) => setIsPM(e.target.value === 'PM')}
                  style={{
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    minWidth: '60px'
                  }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="button"
                onClick={handleTimeSelect}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Set
              </button>
            </div>
          </div>
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
