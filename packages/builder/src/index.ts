// Import styles - single entry point
import './styles/index.css';

// Export FormBuilder
export { FormBuilder } from './FormBuilder';
export type { FormBuilderProps } from './FormBuilder';

// Export FormViewer
export { FormViewer } from './FormViewer';
export type { FormViewerProps } from './FormViewer';

// Export DevicePreviewSwitcher
export { DevicePreviewSwitcher } from './FormBuilder/DevicePreviewSwitcher';

// Export PreviewModal
export { PreviewModal } from './FormBuilder/PreviewModal';

// Export types
export type {
  FieldType,
  FieldDefinition,
  FormSchema,
  FieldValidation,
  FieldStyle,
  SelectOption,
  TextFieldDefinition,
  NumberFieldDefinition,
  SelectFieldDefinition,
  CheckboxFieldDefinition,
  FileFieldDefinition,
  StaticFieldDefinition,
  FieldComponentProps,
  DeviceType,
  DeviceBreakpoint,
} from './types';

export { DEVICE_BREAKPOINTS } from './types';

// Export store if needed for advanced usage
export { useFormStore } from './store/formStore';

// Export validation utilities
export {
  validateField,
  validateForm,
  createCustomValidator,
  commonValidators,
  validators,
  type ValidationError,
  type ValidatorFunction,
} from './utils/validation';