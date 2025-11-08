import React, { useEffect, useState } from 'react';
import { useFormStore } from '../store/formStore';
import { FieldDefinition, SelectOption } from '../types';
import { FormPropertiesTab } from './FormPropertiesTab';

export const PropertiesPanel: React.FC = () => {
  const { schema, selectedFieldId, updateField } = useFormStore();
  const selectedField = schema.fields.find((f) => f.id === selectedFieldId);

  const [activeTab, setActiveTab] = useState<'field' | 'form'>('field');

  useEffect(() => {
    if (!selectedFieldId) {
      setActiveTab('form');
    } else {
      setActiveTab('field');
    }
  }, [selectedFieldId]);

  const handleFieldUpdate = (updates: Partial<FieldDefinition>) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, updates);
    }
  };

  const handleOptionUpdate = (options: SelectOption[]) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { options } as any);
    }
  };

  const addOption = () => {
    if (selectedField && 'options' in selectedField) {
      const newOptions = [
        ...(selectedField.options || []),
        { label: `Option ${(selectedField.options?.length || 0) + 1}`, value: `option${(selectedField.options?.length || 0) + 1}` },
      ];
      handleOptionUpdate(newOptions);
    }
  };

  const removeOption = (index: number) => {
    if (selectedField && 'options' in selectedField && selectedField.options) {
      const newOptions = selectedField.options.filter((_, i) => i !== index);
      handleOptionUpdate(newOptions);
    }
  };

  const updateOption = (index: number, field: 'label' | 'value', value: string) => {
    if (selectedField && 'options' in selectedField && selectedField.options) {
      const newOptions = [...selectedField.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      handleOptionUpdate(newOptions);
    }
  };

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>Properties</h3>
      </div>

      <div className="panel-tabs">
        <button
          className={`tab ${activeTab === 'field' ? 'active' : ''}`}
          onClick={() => setActiveTab('field')}
          disabled={!selectedField}
        >
          Field
        </button>
        <button
          className={`tab ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Form
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'field' && selectedField ? (
          <div className="field-properties">
            <div className="property-section">
              <h4>Basic Properties</h4>

              <div className="property-group">
                <label>Label</label>
                <input
                  type="text"
                  value={selectedField.label || ''}
                  onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                />
              </div>

              <div className="property-group">
                <label>Field Name</label>
                <input
                  type="text"
                  value={selectedField.name || ''}
                  onChange={(e) => handleFieldUpdate({ name: e.target.value })}
                />
              </div>

{!['rating', 'range', 'switch'].includes(selectedField.type) && (
              <div className="property-group">
                <label>Placeholder</label>
                <input
                  type="text"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                />
              </div>
              )}

              <div className="property-group">
                <label>Help Text</label>
                <input
                  type="text"
                  value={selectedField.helpText || ''}
                  onChange={(e) => handleFieldUpdate({ helpText: e.target.value })}
                />
              </div>

{!['rating', 'daterange', 'time', 'datetime'].includes(selectedField.type) && (
              <div className="property-group">
                <label>Default Value</label>
                <input
                  type="text"
                  value={selectedField.defaultValue || ''}
                  onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
                />
              </div>
              )}
            </div>

            {!['header', 'paragraph', 'divider', 'section', 'alert'].includes(selectedField.type) && (
              <div className="property-section">
                <h4>Validation</h4>

                <div className="property-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedField.required || false}
                      onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                    />
                    Required
                  </label>
                </div>

                <div className="property-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedField.disabled || false}
                      onChange={(e) => handleFieldUpdate({ disabled: e.target.checked })}
                    />
                    Disabled
                  </label>
                </div>

                {['text', 'password', 'textarea', 'phone', 'url', 'richtext'].includes(selectedField.type) && (
                  <>
                    <div className="property-group">
                      <label>Min Length</label>
                      <input
                        type="number"
                        value={selectedField.validation?.minLength || ''}
                        onChange={(e) => handleFieldUpdate({
                          validation: {
                            ...selectedField.validation,
                            minLength: e.target.value ? parseInt(e.target.value) : undefined
                          }
                        })}
                        min="0"
                      />
                    </div>

                    <div className="property-group">
                      <label>Max Length</label>
                      <input
                        type="number"
                        value={selectedField.validation?.maxLength || ''}
                        onChange={(e) => handleFieldUpdate({
                          validation: {
                            ...selectedField.validation,
                            maxLength: e.target.value ? parseInt(e.target.value) : undefined
                          }
                        })}
                        min="0"
                      />
                    </div>

                    {['text', 'phone', 'password'].includes(selectedField.type) && (
                      <div className="property-group">
                        <label>Pattern (RegEx)</label>
                        <input
                          type="text"
                          value={selectedField.validation?.pattern || ''}
                          onChange={(e) => handleFieldUpdate({
                            validation: {
                              ...selectedField.validation,
                              pattern: e.target.value
                            }
                          })}
                          placeholder="e.g., ^[A-Za-z]+$"
                        />
                      </div>
                    )}
                  </>
                )}

                {selectedField.type === 'number' && (
                  <>
                    <div className="property-group">
                      <label>Min Value</label>
                      <input
                        type="number"
                        value={selectedField.validation?.min || ''}
                        onChange={(e) => handleFieldUpdate({
                          validation: {
                            ...selectedField.validation,
                            min: e.target.value ? parseFloat(e.target.value) : undefined
                          }
                        })}
                      />
                    </div>

                    <div className="property-group">
                      <label>Max Value</label>
                      <input
                        type="number"
                        value={selectedField.validation?.max || ''}
                        onChange={(e) => handleFieldUpdate({
                          validation: {
                            ...selectedField.validation,
                            max: e.target.value ? parseFloat(e.target.value) : undefined
                          }
                        })}
                      />
                    </div>
                  </>
                )}

                {selectedField.type === 'range' && (
                  <>
                    <div className="property-group">
                      <label>Min Value</label>
                      <input
                        type="number"
                        value={(selectedField as any).min ?? ''}
                        onChange={(e) => handleFieldUpdate({
                          min: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                      />
                    </div>

                    <div className="property-group">
                      <label>Max Value</label>
                      <input
                        type="number"
                        value={(selectedField as any).max ?? ''}
                        onChange={(e) => handleFieldUpdate({
                          max: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                      />
                    </div>
                  </>
                )}

                <div className="property-group">
                  <label>Error Message</label>
                  <input
                    type="text"
                    value={selectedField.validation?.customMessage || ''}
                    onChange={(e) => handleFieldUpdate({
                      validation: {
                        ...selectedField.validation,
                        customMessage: e.target.value
                      }
                    })}
                    placeholder="Custom validation message"
                  />
                </div>
              </div>
            )}

            {(selectedField.type === 'select' ||
              selectedField.type === 'radio' ||
              selectedField.type === 'checkbox') &&
              'options' in selectedField && (
              <div className="property-section">
                <h4>Options</h4>
                <div className="options-list">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="option-item">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => updateOption(index, 'value', e.target.value)}
                        placeholder="Value"
                      />
                      <button onClick={() => removeOption(index)}>×</button>
                    </div>
                  ))}
                </div>
                <button className="btn-add-option" onClick={addOption}>
                  + Add Option
                </button>
              </div>
            )}


            {selectedField.type === 'time' && (
              <div className="property-section">
                <h4>Time Settings</h4>
                <div className="property-group">
                  <label>Format</label>
                  <select
                    value={(selectedField as any).format || '24'}
                    onChange={(e) => handleFieldUpdate({
                      format: e.target.value as '12' | '24'
                    })}
                  >
                    <option value="24">24 Hour</option>
                    <option value="12">12 Hour</option>
                  </select>
                </div>
                <div className="property-group">
                  <label>Step (seconds)</label>
                  <input
                    type="number"
                    value={(selectedField as any).step || 60}
                    onChange={(e) => handleFieldUpdate({
                      step: parseInt(e.target.value) || 60
                    })}
                    placeholder="60"
                  />
                </div>
              </div>
            )}

            {(selectedField.type === 'file' || selectedField.type === 'image') && (
              <div className="property-section">
                <h4>File Upload Settings</h4>
                <div className="property-group">
                  <label>Accept File Types</label>
                  <input
                    type="text"
                    value={(selectedField as any).accept || (selectedField.type === 'image' ? 'image/*' : '')}
                    onChange={(e) => handleFieldUpdate({ accept: e.target.value })}
                    placeholder={selectedField.type === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                  />
                  <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Examples: image/*, .pdf, .doc, application/pdf
                  </small>
                </div>
                <div className="property-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={(selectedField as any).multiple || false}
                      onChange={(e) => handleFieldUpdate({ multiple: e.target.checked })}
                      style={{ marginRight: '8px' }}
                    />
                    Allow Multiple Files
                  </label>
                </div>
                <div className="property-group">
                  <label>Maximum File Size (MB)</label>
                  <input
                    type="number"
                    value={(selectedField as any).maxSize || 10}
                    onChange={(e) => handleFieldUpdate({ maxSize: parseInt(e.target.value) || 10 })}
                    min={1}
                    max={100}
                    placeholder="10"
                  />
                </div>
                <div className="property-group">
                  <label>Maximum Number of Files</label>
                  <input
                    type="number"
                    value={(selectedField as any).maxFiles || 10}
                    onChange={(e) => handleFieldUpdate({ maxFiles: parseInt(e.target.value) || 10 })}
                    min={1}
                    max={50}
                    placeholder="10"
                  />
                </div>
                <div className="property-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={(selectedField as any).showPreview !== false}
                      onChange={(e) => handleFieldUpdate({ showPreview: e.target.checked })}
                      style={{ marginRight: '8px' }}
                    />
                    Show Image Previews
                  </label>
                </div>
                <div className="property-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={(selectedField as any).buttonText || 'Choose Files'}
                    onChange={(e) => handleFieldUpdate({ buttonText: e.target.value })}
                    placeholder="Choose Files"
                  />
                </div>
                <div className="property-group">
                  <label>Drag & Drop Text</label>
                  <input
                    type="text"
                    value={(selectedField as any).dragDropText || 'or drag and drop files here'}
                    onChange={(e) => handleFieldUpdate({ dragDropText: e.target.value })}
                    placeholder="or drag and drop files here"
                  />
                </div>
              </div>
            )}

            {(selectedField.type === 'file' || selectedField.type === 'image') && (
              <div className="property-section">
                <h4>Upload Configuration</h4>
                <div className="property-group">
                  <label>Upload URL</label>
                  <input
                    type="text"
                    value={(selectedField as any).uploadUrl || ''}
                    onChange={(e) => handleFieldUpdate({ uploadUrl: e.target.value })}
                    placeholder="https://api.example.com/upload"
                  />
                  <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    API endpoint where files will be uploaded
                  </small>
                </div>
                <div className="property-group">
                  <label>HTTP Method</label>
                  <select
                    value={(selectedField as any).uploadMethod || 'POST'}
                    onChange={(e) => handleFieldUpdate({ uploadMethod: e.target.value })}
                  >
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                  </select>
                </div>
                <div className="property-group">
                  <label>File Field Name</label>
                  <input
                    type="text"
                    value={(selectedField as any).uploadFieldName || 'file'}
                    onChange={(e) => handleFieldUpdate({ uploadFieldName: e.target.value })}
                    placeholder="file"
                  />
                  <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Form field name for the uploaded file
                  </small>
                </div>
                <div className="property-group">
                  <label>Additional Headers (JSON)</label>
                  <textarea
                    value={(selectedField as any).uploadHeaders || ''}
                    onChange={(e) => handleFieldUpdate({ uploadHeaders: e.target.value })}
                    placeholder='{"Authorization": "Bearer token"}'
                    rows={3}
                  />
                  <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Optional HTTP headers as JSON object
                  </small>
                </div>
                <div className="property-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={(selectedField as any).withCredentials || false}
                      onChange={(e) => handleFieldUpdate({ withCredentials: e.target.checked })}
                      style={{ marginRight: '8px' }}
                    />
                    Send Cookies (withCredentials)
                  </label>
                </div>
                <div className="property-group">
                  <label>Response Success Key</label>
                  <input
                    type="text"
                    value={(selectedField as any).responseSuccessKey || 'success'}
                    onChange={(e) => handleFieldUpdate({ responseSuccessKey: e.target.value })}
                    placeholder="success"
                  />
                  <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    JSON key to check if upload was successful
                  </small>
                </div>
                <div className="property-group">
                  <label>Response URL Key</label>
                  <input
                    type="text"
                    value={(selectedField as any).responseUrlKey || 'url'}
                    onChange={(e) => handleFieldUpdate({ responseUrlKey: e.target.value })}
                    placeholder="url"
                  />
                  <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    JSON key containing the uploaded file URL
                  </small>
                </div>
              </div>
            )}

            {(selectedField.type === 'header' || selectedField.type === 'paragraph') && (
              <div className="property-section">
                <h4>Content</h4>
                <div className="property-group">
                  <label>Text Content</label>
                  <textarea
                    value={'content' in selectedField ? selectedField.content : ''}
                    onChange={(e) => handleFieldUpdate({ content: e.target.value } as any)}
                    rows={4}
                  />
                </div>
                {selectedField.type === 'header' && (
                  <div className="property-group">
                    <label>Header Level</label>
                    <select
                      value={'level' in selectedField ? selectedField.level : 2}
                      onChange={(e) => handleFieldUpdate({ level: parseInt(e.target.value) } as any)}
                    >
                      <option value={1}>H1</option>
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                      <option value={4}>H4</option>
                      <option value={5}>H5</option>
                      <option value={6}>H6</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : activeTab === 'form' ? (
          <FormPropertiesTab />
        ) : (
          <div className="no-selection">
            <p>Select a field to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
};
