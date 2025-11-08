import React, { useState } from 'react';
import { FieldDefinition, ConditionRule, ConditionOperator, FieldConditions } from '../types';
import { IconRenderer } from './IconRenderer';
import { useFormStore } from '../store/formStore';

interface ConditionalSettingsModalProps {
  field: FieldDefinition;
  onClose: () => void;
}

// Get available operators based on field type
const getOperatorsForFieldType = (fieldType: string): { value: ConditionOperator; label: string; requiresValue: boolean }[] => {
  const operators: { value: ConditionOperator; label: string; requiresValue: boolean }[] = [];

  switch (fieldType) {
    case 'checkbox':
    case 'switch':
      operators.push(
        { value: 'is_checked', label: 'Is Checked', requiresValue: false },
        { value: 'is_not_checked', label: 'Is Not Checked', requiresValue: false }
      );
      break;

    case 'text':
    case 'email':
    case 'password':
    case 'textarea':
    case 'phone':
    case 'url':
    case 'search':
      operators.push(
        { value: 'equals', label: 'Equals', requiresValue: true },
        { value: 'not_equals', label: 'Not Equals', requiresValue: true },
        { value: 'contains', label: 'Contains', requiresValue: true },
        { value: 'not_contains', label: 'Does Not Contain', requiresValue: true },
        { value: 'starts_with', label: 'Starts With', requiresValue: true },
        { value: 'ends_with', label: 'Ends With', requiresValue: true },
        { value: 'is_empty', label: 'Is Empty', requiresValue: false },
        { value: 'is_not_empty', label: 'Is Not Empty', requiresValue: false }
      );
      break;

    case 'number':
    case 'range':
    case 'rating':
      operators.push(
        { value: 'equals', label: 'Equals', requiresValue: true },
        { value: 'not_equals', label: 'Not Equals', requiresValue: true },
        { value: 'greater_than', label: 'Greater Than', requiresValue: true },
        { value: 'less_than', label: 'Less Than', requiresValue: true },
        { value: 'greater_than_or_equal', label: 'Greater Than or Equal', requiresValue: true },
        { value: 'less_than_or_equal', label: 'Less Than or Equal', requiresValue: true },
        { value: 'is_empty', label: 'Is Empty', requiresValue: false },
        { value: 'is_not_empty', label: 'Is Not Empty', requiresValue: false }
      );
      break;

    case 'select':
    case 'radio':
      operators.push(
        { value: 'equals', label: 'Equals', requiresValue: true },
        { value: 'not_equals', label: 'Not Equals', requiresValue: true },
        { value: 'is_empty', label: 'Is Empty', requiresValue: false },
        { value: 'is_not_empty', label: 'Is Not Empty', requiresValue: false }
      );
      break;

    case 'date':
    case 'time':
    case 'datetime':
      operators.push(
        { value: 'equals', label: 'Equals', requiresValue: true },
        { value: 'not_equals', label: 'Not Equals', requiresValue: true },
        { value: 'greater_than', label: 'After', requiresValue: true },
        { value: 'less_than', label: 'Before', requiresValue: true },
        { value: 'is_empty', label: 'Is Empty', requiresValue: false },
        { value: 'is_not_empty', label: 'Is Not Empty', requiresValue: false }
      );
      break;

    default:
      operators.push(
        { value: 'is_empty', label: 'Is Empty', requiresValue: false },
        { value: 'is_not_empty', label: 'Is Not Empty', requiresValue: false }
      );
  }

  return operators;
};

export const ConditionalSettingsModal: React.FC<ConditionalSettingsModalProps> = ({ field, onClose }) => {
  const { schema, updateField } = useFormStore();

  // Filter out current field and non-input fields
  const availableFields = schema.fields.filter(
    f => f.id !== field.id &&
    f.name &&
    !['header', 'paragraph', 'divider', 'alert'].includes(f.type)
  );

  const [action, setAction] = useState<'show' | 'hide'>(field.conditions?.show ? 'show' : 'hide');
  const [logic, setLogic] = useState<'and' | 'or'>(field.conditions?.logic || 'and');
  const [rules, setRules] = useState<ConditionRule[]>(
    field.conditions?.show || field.conditions?.hide || [{ fieldId: '', operator: 'equals' as ConditionOperator, value: '' }]
  );

  const addRule = () => {
    setRules([...rules, { fieldId: '', operator: 'equals' as ConditionOperator, value: '' }]);
  };

  const removeRule = (index: number) => {
    if (rules.length > 1) {
      setRules(rules.filter((_, i) => i !== index));
    }
  };

  const updateRule = (index: number, updates: Partial<ConditionRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updates };

    // If field changed, reset operator and value
    if (updates.fieldId !== undefined) {
      const selectedField = availableFields.find(f => f.id === updates.fieldId);
      if (selectedField) {
        const operators = getOperatorsForFieldType(selectedField.type);
        newRules[index].operator = operators[0]?.value || 'equals';
        newRules[index].value = '';
      }
    }

    setRules(newRules);
  };

  const handleSave = () => {
    // Validate rules
    const validRules = rules.filter(rule =>
      rule.fieldId && rule.operator
    );

    if (validRules.length === 0) {
      // No valid rules, remove conditions
      updateField(field.id, { conditions: undefined });
    } else {
      const conditions: FieldConditions = {
        [action]: validRules,
        logic
      };
      updateField(field.id, { conditions });
    }

    onClose();
  };

  const handleClearConditions = () => {
    updateField(field.id, { conditions: undefined });
    onClose();
  };

  // Check if there are no available fields
  if (availableFields.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Conditional Settings</h3>
            <button className="modal-close" onClick={onClose} title="Close">
              <IconRenderer icon="close" />
            </button>
          </div>

          <div className="modal-body">
            <div className="condition-empty-state">
              <div className="condition-empty-icon">
                <IconRenderer icon="warning" />
              </div>
              <div className="condition-empty-title">No Fields Available</div>
              <div className="condition-empty-text">
                To add conditional logic, you need at least one other input field in your form.
                Add more fields to your form to create conditions.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="condition-btn condition-btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content condition-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Conditional Settings</h3>
          <button className="modal-close" onClick={onClose} title="Close">
            <IconRenderer icon="close" />
          </button>
        </div>

        <div className="modal-body">
          {/* Current Field Info */}
          <div className="condition-field-info">
            <span className="condition-field-label">Current Field</span>
            <div className="condition-field-value">
              {field.label || field.name || 'Unnamed Field'}
              <span className="condition-field-type">{field.type}</span>
            </div>
          </div>

          {/* Action Selection */}
          <div className="condition-section">
            <label className="condition-section-label">Action</label>
            <div className="toggle-group">
              <div className="toggle-option">
                <input
                  type="radio"
                  id="action-show"
                  value="show"
                  checked={action === 'show'}
                  onChange={(e) => setAction(e.target.value as 'show' | 'hide')}
                />
                <label htmlFor="action-show">
                  <span className="toggle-icon">
                    <IconRenderer icon="visibility" />
                  </span>
                  Show field when conditions are met
                </label>
              </div>
              <div className="toggle-option">
                <input
                  type="radio"
                  id="action-hide"
                  value="hide"
                  checked={action === 'hide'}
                  onChange={(e) => setAction(e.target.value as 'show' | 'hide')}
                />
                <label htmlFor="action-hide">
                  <span className="toggle-icon">
                    <IconRenderer icon="visibility_off" />
                  </span>
                  Hide field when conditions are met
                </label>
              </div>
            </div>
          </div>

          {/* Logic Selection (if multiple rules) */}
          {rules.length > 1 && (
            <div className="condition-section">
              <label className="condition-section-label">Match Conditions</label>
              <div className="logic-toggle-group">
                <div className="logic-toggle-option">
                  <input
                    type="radio"
                    id="logic-and"
                    value="and"
                    checked={logic === 'and'}
                    onChange={(e) => setLogic(e.target.value as 'and' | 'or')}
                  />
                  <label htmlFor="logic-and">All (AND)</label>
                </div>
                <div className="logic-toggle-option">
                  <input
                    type="radio"
                    id="logic-or"
                    value="or"
                    checked={logic === 'or'}
                    onChange={(e) => setLogic(e.target.value as 'and' | 'or')}
                  />
                  <label htmlFor="logic-or">Any (OR)</label>
                </div>
              </div>
            </div>
          )}

          {/* Rules */}
          <div className="condition-section">
            <label className="condition-section-label">Conditions</label>

            <div className="condition-rules-list">
              {rules.map((rule, index) => {
                const selectedField = availableFields.find(f => f.id === rule.fieldId);
                const operators = selectedField ? getOperatorsForFieldType(selectedField.type) : [];
                const currentOperator = operators.find(op => op.value === rule.operator);

                return (
                  <div key={index} className="condition-card">
                    <div className="condition-card-content">
                      {/* Field Selection */}
                      <select
                        value={rule.fieldId}
                        onChange={(e) => updateRule(index, { fieldId: e.target.value })}
                        className="condition-select"
                      >
                        <option value="">Select a field...</option>
                        {availableFields.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.label || f.name || 'Unnamed'} ({f.type})
                          </option>
                        ))}
                      </select>

                      {/* Operator Selection */}
                      {rule.fieldId && (
                        <select
                          value={rule.operator}
                          onChange={(e) => updateRule(index, { operator: e.target.value as ConditionOperator })}
                          className="condition-select"
                        >
                          {operators.map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Value Input (if required) */}
                      {rule.fieldId && currentOperator?.requiresValue && (
                        <input
                          type="text"
                          value={rule.value || ''}
                          onChange={(e) => updateRule(index, { value: e.target.value })}
                          placeholder="Enter value..."
                          className="condition-input"
                        />
                      )}
                    </div>

                    {/* Remove Button */}
                    <div className="condition-card-actions">
                      <button
                        onClick={() => removeRule(index)}
                        disabled={rules.length === 1}
                        title="Remove condition"
                        className={`condition-btn condition-btn-icon condition-btn-danger ${rules.length === 1 ? 'disabled' : ''}`}
                      >
                        <IconRenderer icon="delete" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Rule Button */}
            <button onClick={addRule} className="condition-btn condition-btn-add">
              <IconRenderer icon="add" />
              Add Condition
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleClearConditions} className="condition-btn condition-btn-danger" style={{ marginRight: 'auto' }}>
            Clear Conditions
          </button>
          <button onClick={onClose} className="condition-btn condition-btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="condition-btn condition-btn-primary">
            Save Conditions
          </button>
        </div>
      </div>
    </div>
  );
};