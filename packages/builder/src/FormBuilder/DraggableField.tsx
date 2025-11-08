import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FieldType } from '../types';
import { IconRenderer } from './IconRenderer';

interface DraggableFieldProps {
  fieldType: FieldType;
  label: string;
  icon?: string;
}

export const DraggableField: React.FC<DraggableFieldProps> = ({
  fieldType,
  label,
  icon,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-${fieldType}`,
    data: {
      type: 'new-field',
      fieldType,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-field"
      role="button"
      tabIndex={0}
    >
      {icon && <IconRenderer icon={icon} className="field-icon" />}
      <span className="field-label">{label}</span>
    </div>
  );
};