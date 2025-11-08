import { ConditionRule, FieldDefinition } from '../../types';

/**
 * Evaluates a single condition rule
 */
export const evaluateConditionRule = (
  rule: ConditionRule,
  fieldValue: any,
  field: FieldDefinition | undefined
): boolean => {
  if (!field) return false;

  const { operator, value: conditionValue } = rule;

  // Handle empty/undefined values
  const isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === '';
  const isArray = Array.isArray(fieldValue);
  const isBoolean = typeof fieldValue === 'boolean';

  switch (operator) {
    // Boolean operators
    case 'is_checked':
      return isBoolean ? fieldValue === true : !!fieldValue;

    case 'is_not_checked':
      return isBoolean ? fieldValue === false : !fieldValue;

    // Empty/Not Empty operators
    case 'is_empty':
      if (isArray) return fieldValue.length === 0;
      return isEmpty;

    case 'is_not_empty':
      if (isArray) return fieldValue.length > 0;
      return !isEmpty;

    // String operators
    case 'equals':
      return String(fieldValue) === String(conditionValue);

    case 'not_equals':
      return String(fieldValue) !== String(conditionValue);

    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());

    case 'not_contains':
      return !String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());

    case 'starts_with':
      return String(fieldValue).toLowerCase().startsWith(String(conditionValue).toLowerCase());

    case 'ends_with':
      return String(fieldValue).toLowerCase().endsWith(String(conditionValue).toLowerCase());

    // Numeric operators
    case 'greater_than':
      return Number(fieldValue) > Number(conditionValue);

    case 'less_than':
      return Number(fieldValue) < Number(conditionValue);

    case 'greater_than_or_equal':
      return Number(fieldValue) >= Number(conditionValue);

    case 'less_than_or_equal':
      return Number(fieldValue) <= Number(conditionValue);

    // Array operators
    case 'includes':
      if (isArray) {
        return fieldValue.includes(conditionValue);
      }
      return false;

    case 'not_includes':
      if (isArray) {
        return !fieldValue.includes(conditionValue);
      }
      return false;

    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
};

/**
 * Evaluates multiple condition rules based on logic (AND/OR)
 */
export const evaluateConditionRules = (
  rules: ConditionRule[],
  logic: 'and' | 'or',
  allFields: FieldDefinition[],
  formValues: Record<string, any>
): boolean => {
  if (!rules || rules.length === 0) return true;

  const results = rules.map(rule => {
    const field = allFields.find(f => f.id === rule.fieldId);
    if (!field || !field.name) return false;

    const fieldValue = formValues[field.name];
    return evaluateConditionRule(rule, fieldValue, field);
  });

  if (logic === 'or') {
    return results.some(result => result === true);
  } else {
    return results.every(result => result === true);
  }
};

/**
 * Determines if a field should be visible based on its conditions
 */
export const shouldFieldBeVisible = (
  field: FieldDefinition,
  allFields: FieldDefinition[],
  formValues: Record<string, any>
): boolean => {
  // If no conditions, field is always visible (unless explicitly hidden)
  if (!field.conditions) {
    return !field.hidden;
  }

  const { show, hide, logic = 'and' } = field.conditions;

  // Evaluate show conditions
  if (show && show.length > 0) {
    const shouldShow = evaluateConditionRules(show, logic, allFields, formValues);
    return shouldShow && !field.hidden;
  }

  // Evaluate hide conditions
  if (hide && hide.length > 0) {
    const shouldHide = evaluateConditionRules(hide, logic, allFields, formValues);
    return !shouldHide && !field.hidden;
  }

  // Default: visible (unless explicitly hidden)
  return !field.hidden;
};

/**
 * Filters visible fields from a list based on their conditions
 */
export const getVisibleFields = (
  fields: FieldDefinition[],
  formValues: Record<string, any>
): FieldDefinition[] => {
  return fields.filter(field => shouldFieldBeVisible(field, fields, formValues));
};