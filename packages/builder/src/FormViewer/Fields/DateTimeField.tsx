import React, { useState, useRef, useEffect } from 'react';
import { BaseFieldProps } from './types';

interface DateTimeFieldProps extends BaseFieldProps {
  format?: '12' | '24';
  minDate?: string;
  maxDate?: string;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
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
  minDate,
  maxDate,
  onChange,
  onBlur,
}) => {
  const fieldId = `field-${id || name}`;
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState<number | undefined>(undefined);
  const [selectedMinute, setSelectedMinute] = useState<number | undefined>(undefined);
  const [isPM, setIsPM] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Parse the value when it changes
  useEffect(() => {
    if (value) {
      const valueStr = value.toString();
      const [datePart, timePart] = valueStr.includes('T') ? valueStr.split('T') : valueStr.split(' ');
      setSelectedDate(datePart || '');

      if (timePart) {
        const [hours, minutes] = timePart.split(':').map(Number);
        if (format === '12') {
          setIsPM(hours >= 12);
          setSelectedHour(hours > 12 ? hours - 12 : hours === 0 ? 12 : hours);
        } else {
          setSelectedHour(hours);
        }
        setSelectedMinute(minutes || 0);
      }
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

  const formatDisplayDateTime = () => {
    if (!value) return '';
    const valueStr = value.toString();
    const [datePart, timePart] = valueStr.includes('T') ? valueStr.split('T') : valueStr.split(' ');

    if (!timePart) return datePart;

    const [hours, minutes] = timePart.split(':').map(Number);
    const displayDate = new Date(datePart).toLocaleDateString();

    if (format === '12') {
      const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${displayDate} ${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    return `${displayDate} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleDateTimeSelect = () => {
    if (!selectedDate || selectedHour === undefined || selectedMinute === undefined) return;

    let hours = selectedHour;
    if (format === '12') {
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    }

    const dateTimeString = `${selectedDate}T${hours.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onChange?.(dateTimeString);
    setShowPicker(false);
  };

  const hours = format === '12'
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);

  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="form-field form-field-datetime">
      {label && (
        <label htmlFor={fieldId} className="form-field-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div className="datetime-input-wrapper" style={{ position: 'relative' }}>
        <input
          id={fieldId}
          name={name}
          type="text"
          className={`form-field-input ${error ? 'has-error' : ''}`}
          placeholder={placeholder || (format === '12' ? 'MM/DD/YYYY hh:mm AM/PM' : 'MM/DD/YYYY HH:mm')}
          required={required}
          disabled={disabled}
          readOnly
          value={formatDisplayDateTime()}
          onClick={() => !disabled && !readonly && setShowPicker(true)}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          style={{ cursor: disabled || readonly ? 'default' : 'pointer' }}
        />
        {showPicker && !disabled && !readonly && (
          <div
            ref={pickerRef}
            className="datetime-picker-dropdown"
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
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDate}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
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
            </div>
            <button
              type="button"
              onClick={handleDateTimeSelect}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                alignSelf: 'flex-end'
              }}
            >
              Set
            </button>
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
