import React, { useState } from 'react';
import { FormBuilder } from '../FormBuilder/FormBuilder';
import { FormViewer } from '../FormViewer/FormViewer';
import { FormSchema } from '../types';

export const FormViewerExample: React.FC = () => {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleFormChange = (newSchema: FormSchema) => {
    setSchema(newSchema);
    console.log('Form Schema Updated:', newSchema);
  };

  const handleFormSubmit = (values: Record<string, any>) => {
    console.log('Form Submitted with values:', values);
    alert('Form submitted! Check console for values.');
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    console.log(`Field "${fieldName}" changed to:`, value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{
        padding: '10px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', flex: 1 }}>FormMorf Example</h1>
        <button
          onClick={() => setShowViewer(!showViewer)}
          style={{
            padding: '8px 16px',
            backgroundColor: showViewer ? '#3b82f6' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer'
          }}
        >
          {showViewer ? 'Edit Form' : 'Preview Form'}
        </button>
      </div>

      {!showViewer ? (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <FormBuilder
            onChange={handleFormChange}
            initialSchema={schema || undefined}
          />
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {schema && schema.fields.length > 0 ? (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <FormViewer
                schema={schema}
                onSubmit={handleFormSubmit}
                onFieldChange={handleFieldChange}
              />
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <p>No form fields to preview. Please add some fields in the builder first.</p>
              <button
                onClick={() => setShowViewer(false)}
                style={{
                  marginTop: '20px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
              >
                Go to Builder
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};