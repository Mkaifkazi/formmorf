import React, { useState } from 'react';

interface SectionFieldProps {
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
}

export const SectionField: React.FC<SectionFieldProps> = ({
  title,
  description,
  collapsible = false,
  defaultExpanded = true,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`form-field-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {(title || description) && (
        <div
          className={`form-field-section-header ${collapsible ? 'collapsible' : ''}`}
          onClick={handleToggle}
          role={collapsible ? 'button' : undefined}
          tabIndex={collapsible ? 0 : undefined}
          onKeyPress={collapsible ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleToggle();
            }
          } : undefined}
        >
          <div className="form-field-section-header-content">
            {title && <h3 className="form-field-section-title">{title}</h3>}
            {description && <p className="form-field-section-description">{description}</p>}
          </div>
          {collapsible && (
            <span className="form-field-section-toggle">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </div>
      )}
      {(!collapsible || isExpanded) && (
        <div className="form-field-section-content">
          {children}
        </div>
      )}
    </div>
  );
};