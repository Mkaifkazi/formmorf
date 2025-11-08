// Device Preview Types
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface DeviceBreakpoint {
  type: DeviceType;
  label: string;
  width: number;
  height?: number;
  icon: string;
}

export const DEVICE_BREAKPOINTS: Record<DeviceType, DeviceBreakpoint> = {
  desktop: {
    type: 'desktop',
    label: 'Desktop',
    width: 1200,
    icon: 'computer',
  },
  tablet: {
    type: 'tablet',
    label: 'Tablet',
    width: 768,
    height: 1024,
    icon: 'tablet',
  },
  mobile: {
    type: 'mobile',
    label: 'Mobile',
    width: 375,
    height: 667,
    icon: 'phone_iphone',
  },
};

export type FieldType =
  // Input Fields
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'phone'
  | 'url'
  | 'search'
  // Choice Fields
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'rating'
  | 'range'
  // Date & Time
  | 'date'
  | 'time'
  | 'datetime'
  | 'daterange'
  // Rich Inputs
  | 'richtext'
  | 'color'
  | 'file'
  | 'image'
  | 'signature'
  // Layout & Display
  | 'header'
  | 'paragraph'
  | 'divider'
  | 'section'
  | 'alert';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customMessage?: string;
}

// Conditional Logic Types
export type ConditionOperator =
  // Boolean operators (for checkbox, switch)
  | 'is_checked'
  | 'is_not_checked'
  // Comparison operators (for text, number, select, etc.)
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  // Numeric operators (for number, range, rating)
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  // Array operators (for checkbox groups, multi-select)
  | 'includes'
  | 'not_includes';

export interface ConditionRule {
  fieldId: string;       // The field to check
  operator: ConditionOperator;
  value?: any;           // Value to compare against (optional for boolean operators)
}

export interface FieldConditions {
  show?: ConditionRule[];  // Show field when conditions are met
  hide?: ConditionRule[];  // Hide field when conditions are met
  logic?: 'and' | 'or';    // How to combine multiple conditions (default: 'and')
}

export interface FieldStyle {
  width?: '25%' | '50%' | '75%' | '100%';
  className?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface BaseFieldDefinition {
  id: string;
  type: FieldType;
  name?: string;
  label?: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  validation?: FieldValidation;
  style?: FieldStyle;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  conditions?: FieldConditions;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectFieldDefinition extends BaseFieldDefinition {
  type: 'select' | 'radio';
  options: SelectOption[];
  multiple?: boolean;
}

export interface TextFieldDefinition extends BaseFieldDefinition {
  type: 'text' | 'email' | 'password' | 'textarea' | 'phone' | 'url' | 'search';
  maxLength?: number;
  pattern?: string;
}

export interface NumberFieldDefinition extends BaseFieldDefinition {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface CheckboxFieldDefinition extends BaseFieldDefinition {
  type: 'checkbox';
  options?: SelectOption[];
}

export interface FileFieldDefinition extends BaseFieldDefinition {
  type: 'file' | 'image' | 'signature';
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  showPreview?: boolean;
  buttonText?: string;
  dragDropText?: string;
  uploadUrl?: string;
  uploadMethod?: string;
  uploadFieldName?: string;
  uploadHeaders?: string;
  withCredentials?: boolean;
  responseSuccessKey?: string;
  responseUrlKey?: string;
}

export interface StaticFieldDefinition extends BaseFieldDefinition {
  type: 'header' | 'paragraph' | 'divider' | 'alert';
  content?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  alertType?: 'info' | 'success' | 'warning' | 'error';
}

export interface RangeFieldDefinition extends BaseFieldDefinition {
  type: 'range';
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

export interface RatingFieldDefinition extends BaseFieldDefinition {
  type: 'rating';
  maxRating?: number;
  allowHalf?: boolean;
  icon?: string;
}

export interface SwitchFieldDefinition extends BaseFieldDefinition {
  type: 'switch';
  onLabel?: string;
  offLabel?: string;
}

export interface RichTextFieldDefinition extends BaseFieldDefinition {
  type: 'richtext';
  toolbar?: string[];
  maxLength?: number;
}

export interface DateRangeFieldDefinition extends BaseFieldDefinition {
  type: 'daterange';
  minDate?: string;
  maxDate?: string;
  startLabel?: string;
  endLabel?: string;
}

export interface ColorFieldDefinition extends BaseFieldDefinition {
  type: 'color';
  format?: 'hex' | 'rgb' | 'hsl';
  showInput?: boolean;
}

export interface TimeFieldDefinition extends BaseFieldDefinition {
  type: 'time';
  format?: '12' | '24';
  minTime?: string;
  maxTime?: string;
}

export interface DateTimeFieldDefinition extends BaseFieldDefinition {
  type: 'datetime';
  format?: '12' | '24';
  minDate?: string;
  maxDate?: string;
}

export interface DateFieldDefinition extends BaseFieldDefinition {
  type: 'date';
  minDate?: string;
  maxDate?: string;
}

export interface SectionFieldDefinition extends BaseFieldDefinition {
  type: 'section';
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  fields?: FieldDefinition[];
}

export type FieldDefinition =
  | TextFieldDefinition
  | NumberFieldDefinition
  | SelectFieldDefinition
  | CheckboxFieldDefinition
  | FileFieldDefinition
  | StaticFieldDefinition
  | RangeFieldDefinition
  | RatingFieldDefinition
  | SwitchFieldDefinition
  | RichTextFieldDefinition
  | DateRangeFieldDefinition
  | ColorFieldDefinition
  | TimeFieldDefinition
  | DateTimeFieldDefinition
  | DateFieldDefinition
  | SectionFieldDefinition
  | BaseFieldDefinition;

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FieldDefinition[];
  settings?: {
    submitButtonText?: string;
    cancelButtonText?: string;
    showLabels?: boolean;
    labelPosition?: 'top' | 'left' | 'right';
    theme?: 'light' | 'dark';
    clearOnSubmit?: boolean;
  };
  version?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FieldComponentProps {
  field: FieldDefinition;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  readonly?: boolean;
}

export interface DragItem {
  type: 'new-field' | 'existing-field';
  fieldType?: FieldType;
  fieldId?: string;
  index?: number;
}

export interface FieldCategory {
  name: string;
  icon?: string;
  fields: {
    type: FieldType;
    label: string;
    icon?: string;
  }[];
}