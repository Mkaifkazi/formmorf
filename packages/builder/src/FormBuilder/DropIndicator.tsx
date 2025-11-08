import React from 'react';

interface DropIndicatorProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ 
  isVisible, 
  message = 'Drop here to insert',
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className={`drop-indicator ${className}`}>
      <div className="drop-indicator-text">{message}</div>
    </div>
  );
};
