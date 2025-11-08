import React, { useState } from 'react';
import { useFormStore } from '../store/formStore';
import { IconRenderer } from './IconRenderer';
import { PreviewModal } from './PreviewModal';
import type { FormSchema } from '../types';

interface ToolbarProps {
  onExportSchema?: (schema: any) => void;
  onImportSchema?: () => void;
}

// Validate imported schema structure
const validateImportedSchema = (schema: any): schema is FormSchema => {
  // Check if it has the required properties
  if (!schema || typeof schema !== 'object') return false;

  // Must have fields array
  if (!Array.isArray(schema.fields)) return false;

  // Each field must have at least id, type, and label
  for (const field of schema.fields) {
    if (!field.id || !field.type || !field.label) {
      return false;
    }
  }

  // If it has settings, validate it's an object
  if (schema.settings && typeof schema.settings !== 'object') {
    return false;
  }

  return true;
};

export const Toolbar: React.FC<ToolbarProps> = ({ onExportSchema, onImportSchema }) => {
  const { schema, clearForm, undo, redo, canUndo, canRedo } = useFormStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleExport = () => {
    const schemaJson = JSON.stringify(schema, null, 2);

    if (onExportSchema) {
      onExportSchema(schema);
    } else {
      // Download as JSON file
      const blob = new Blob([schemaJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${schema.title || 'form'}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    if (onImportSchema) {
      onImportSchema();
    } else {
      // Create file input for import
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          try {
            const importedSchema = JSON.parse(text);

            // Validate the imported schema structure
            if (!validateImportedSchema(importedSchema)) {
              alert('Invalid form schema. Please check the file format.');
              return;
            }

            // Load the schema into the store
            const { setSchema } = useFormStore.getState();
            setSchema(importedSchema);

            console.log('Successfully imported form:', importedSchema.title);
          } catch (error) {
            console.error('Invalid JSON file:', error);
            alert('Invalid JSON file. Please check the file format.');
          }
        }
      };
      input.click();
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the form? This action cannot be undone.')) {
      clearForm();
    }
  };

  return (
    <div className="toolbar">
      <button
        className="toolbar-button"
        onClick={() => undo()}
        disabled={!canUndo()}
        title="Undo (Ctrl+Z)"
      >
        <IconRenderer icon="undo" size="small" />
        <span>Undo</span>
      </button>

      <button
        className="toolbar-button"
        onClick={() => redo()}
        disabled={!canRedo()}
        title="Redo (Ctrl+Y)"
      >
        <IconRenderer icon="redo" size="small" />
        <span>Redo</span>
      </button>

      <div className="toolbar-separator" />

      <button className="toolbar-button" onClick={handleClear}>
        <IconRenderer icon="delete" size="small" />
        <span>Clear Form</span>
      </button>

      <div className="toolbar-separator" />

      <button className="toolbar-button" onClick={handleImport}>
        <IconRenderer icon="upload" size="small" />
        <span>Import</span>
      </button>

      <button className="toolbar-button" onClick={handleExport}>
        <IconRenderer icon="download" size="small" />
        <span>Export JSON</span>
      </button>

      <div className="toolbar-separator" />

      <button
        className="toolbar-button toolbar-button-primary"
        onClick={() => setIsPreviewOpen(true)}
        title="Preview Form"
      >
        <IconRenderer icon="visibility" size="small" />
        <span>Preview</span>
      </button>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};