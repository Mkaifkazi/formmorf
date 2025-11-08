import React, { useEffect } from 'react';
import { ComponentPanel } from './ComponentPanel';
import { FormCanvas } from './FormCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { Toolbar } from './Toolbar';
import { DndWrapper } from './DndWrapper';
import { useFormStore } from '../store/formStore';
import { FormSchema } from '../types';

export interface FormBuilderProps {
  initialSchema?: FormSchema;
  onChange?: (schema: FormSchema) => void;
  onSave?: (schema: FormSchema) => void;
  onExportSchema?: (schema: FormSchema) => void;
  className?: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  onChange,
  onSave,
  onExportSchema,
  className = ""
}) => {
  const { schema, setSchema, undo, redo, canUndo, canRedo } = useFormStore();

  useEffect(() => {
    if (initialSchema) {
      setSchema(initialSchema);
    }
  }, [initialSchema, setSchema]);

  useEffect(() => {
    if (onChange) {
      onChange(schema);
    }
  }, [schema, onChange]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl (Windows/Linux) or Cmd (Mac)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      // Undo: Ctrl+Z or Cmd+Z
      if (e.key === 'z' && !e.shiftKey && canUndo()) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl+Y or Cmd+Shift+Z (Mac) or Ctrl+Shift+Z (Windows)
      else if (
        (e.key === 'y' && !isMac) ||
        (e.key === 'z' && e.shiftKey)
      ) {
        if (canRedo()) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const handleExportSchema = (exportedSchema: FormSchema) => {
    if (onExportSchema) {
      onExportSchema(exportedSchema);
    }
    if (onSave) {
      onSave(exportedSchema);
    }
  };

  return (
    <DndWrapper>
      <div className={`form-builder-container ${className}`}>
        <ComponentPanel />

        <div className="form-canvas-wrapper">
          <Toolbar onExportSchema={handleExportSchema} />
          <FormCanvas />
        </div>

        <PropertiesPanel />
      </div>
    </DndWrapper>
  );
};