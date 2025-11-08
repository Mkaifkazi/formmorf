export interface BaseFieldProps {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  value?: any;
  error?: string;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  className?: string;
}

export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}