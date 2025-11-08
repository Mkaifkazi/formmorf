import React from 'react';

interface AlertFieldProps {
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
}

export const AlertField: React.FC<AlertFieldProps> = ({
  title,
  message,
  type = 'info',
  dismissible = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`form-field-alert form-field-alert-${type}`}>
      <div className="form-field-alert-content">
        <span className="form-field-alert-icon">{getIcon()}</span>
        <div className="form-field-alert-text">
          {title && <div className="form-field-alert-title">{title}</div>}
          {message && <div className="form-field-alert-message">{message}</div>}
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="form-field-alert-dismiss"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};