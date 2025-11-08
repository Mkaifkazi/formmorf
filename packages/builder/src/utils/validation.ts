import { FieldDefinition } from '../types';

export interface ValidationError {
  fieldId: string;
  message: string;
}

export type ValidatorFunction = (value: any, field: FieldDefinition, formValues?: Record<string, any>) => string | null;

export const validators: Record<string, ValidatorFunction> = {
  required: (value, field) => {
    if (field.required && !value) {
      return field.validation?.customMessage || `${field.label || 'This field'} is required`;
    }
    return null;
  },

  minLength: (value, field) => {
    if (field.validation?.minLength && value && value.length < field.validation.minLength) {
      return `Minimum length is ${field.validation.minLength} characters`;
    }
    return null;
  },

  maxLength: (value, field) => {
    if (field.validation?.maxLength && value && value.length > field.validation.maxLength) {
      return `Maximum length is ${field.validation.maxLength} characters`;
    }
    return null;
  },

  min: (value, field) => {
    if (field.validation?.min !== undefined && value < field.validation.min) {
      return `Minimum value is ${field.validation.min}`;
    }
    return null;
  },

  max: (value, field) => {
    if (field.validation?.max !== undefined && value > field.validation.max) {
      return `Maximum value is ${field.validation.max}`;
    }
    return null;
  },

  email: (value, field) => {
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    return null;
  },

  phone: (value, field) => {
    // No default validation for phone fields
    return null;
  },

  url: (value, field) => {
    if (field.type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        return 'Please enter a valid URL';
      }
    }
    return null;
  },

  pattern: (value, field) => {
    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.customMessage || 'Invalid format';
      }
    }
    return null;
  },
};

export const validateField = (
  field: FieldDefinition,
  value: any,
  formValues?: Record<string, any>
): string | null => {
  // Skip validation for static fields
  if (['header', 'paragraph', 'divider', 'section', 'alert'].includes(field.type)) {
    return null;
  }

  // Run built-in validators
  for (const validatorName in validators) {
    const error = validators[validatorName](value, field, formValues);
    if (error) {
      return error;
    }
  }

  // Run custom validation if provided
  if (field.validation && 'custom' in field.validation && typeof field.validation.custom === 'function') {
    const customError = field.validation.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
};

export const validateForm = (
  fields: FieldDefinition[],
  formValues: Record<string, any>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  fields.forEach(field => {
    const value = formValues[field.name || field.id];
    const error = validateField(field, value, formValues);

    if (error) {
      errors.push({
        fieldId: field.id,
        message: error,
      });
    }
  });

  return errors;
};

export const createCustomValidator = (
  validationFn: (value: any, formValues?: Record<string, any>) => boolean,
  errorMessage: string
): ValidatorFunction => {
  return (value, field, formValues) => {
    const isValid = validationFn(value, formValues);
    return isValid ? null : errorMessage;
  };
};

// Common custom validators
export const commonValidators = {
  confirmPassword: createCustomValidator(
    (value, formValues) => {
      return value === formValues?.password;
    },
    'Passwords do not match'
  ),

  minAge: (minAge: number) => createCustomValidator(
    (value) => {
      if (!value) return true;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= minAge;
    },
    `Must be at least ${minAge} years old`
  ),

  fileSize: (maxSizeInMB: number) => createCustomValidator(
    (value) => {
      if (!value || !value[0]) return true;
      const file = value[0];
      return file.size <= maxSizeInMB * 1024 * 1024;
    },
    `File size must be less than ${maxSizeInMB}MB`
  ),

  futureDate: createCustomValidator(
    (value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    'Date must be in the future'
  ),

  pastDate: createCustomValidator(
    (value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    'Date must be in the past'
  ),
};
