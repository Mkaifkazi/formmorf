import { FieldCategory, FieldType, FieldDefinition } from '../types';

export const FIELD_CATEGORIES: FieldCategory[] = [
  {
    name: 'Basic Input',
    icon: 'text_fields',
    fields: [
      { type: 'text', label: 'Text Input', icon: 'text_fields' },
      { type: 'number', label: 'Number', icon: 'numbers' },
      { type: 'email', label: 'Email', icon: 'email' },
      { type: 'password', label: 'Password', icon: 'lock' },
      { type: 'phone', label: 'Phone', icon: 'phone' },
      { type: 'url', label: 'URL', icon: 'link' },
      { type: 'textarea', label: 'Text Area', icon: 'notes' },
    ],
  },
  {
    name: 'Choice',
    icon: 'checklist',
    fields: [
      { type: 'select', label: 'Dropdown', icon: 'arrow_drop_down' },
      { type: 'checkbox', label: 'Checkbox', icon: 'check_box' },
      { type: 'radio', label: 'Radio Group', icon: 'radio_button_checked' },
      { type: 'switch', label: 'Switch', icon: 'toggle_on' },
      { type: 'rating', label: 'Rating', icon: 'star' },
      { type: 'range', label: 'Range Slider', icon: 'tune' },
    ],
  },
  {
    name: 'Date & Time',
    icon: 'event',
    fields: [
      { type: 'date', label: 'Date Picker', icon: 'calendar_today' },
      { type: 'time', label: 'Time Picker', icon: 'access_time' },
      { type: 'datetime', label: 'Date & Time', icon: 'event' },
      { type: 'daterange', label: 'Date Range', icon: 'date_range' },
    ],
  },
  {
    name: 'Rich Inputs',
    icon: 'palette',
    fields: [
      { type: 'richtext', label: 'Rich Text Editor', icon: 'format_color_text' },
      { type: 'file', label: 'File Upload', icon: 'attach_file' },
      { type: 'image', label: 'Image Upload', icon: 'image' },
      { type: 'signature', label: 'Signature', icon: 'draw' },
    ],
  },
  {
    name: 'Layout & Display',
    icon: 'dashboard',
    fields: [
      { type: 'header', label: 'Header', icon: 'title' },
      { type: 'paragraph', label: 'Paragraph', icon: 'subject' },
      { type: 'divider', label: 'Divider', icon: 'horizontal_rule' },
      { type: 'section', label: 'Section', icon: 'view_agenda' },
      { type: 'alert', label: 'Alert', icon: 'warning' },
    ],
  },
];

export const getDefaultFieldConfig = (type: FieldType): Partial<FieldDefinition> => {
  const baseConfig: Partial<FieldDefinition> = {
    type,
    label: '',
    placeholder: '',
    helpText: '',
    required: false,
    disabled: false,
    hidden: false,
    style: {
      width: '100%',
      textAlign: 'left',
    },
  };

  switch (type) {
    case 'text':
      return {
        ...baseConfig,
        label: 'Text Field',
        placeholder: 'Enter text...',
        name: 'text_field',
      };
    case 'number':
      return {
        ...baseConfig,
        label: 'Number Field',
        placeholder: 'Enter number...',
        name: 'number_field',
      };
    case 'email':
      return {
        ...baseConfig,
        label: 'Email',
        placeholder: 'email@example.com',
        name: 'email',
      };
    case 'password':
      return {
        ...baseConfig,
        label: 'Password',
        placeholder: 'Enter password...',
        name: 'password',
      };
    case 'textarea':
      return {
        ...baseConfig,
        label: 'Text Area',
        placeholder: 'Enter multiple lines of text...',
        name: 'textarea',
      };
    case 'select':
      return {
        ...baseConfig,
        label: 'Select',
        placeholder: 'Choose an option',
        name: 'select_field',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
      };
    case 'checkbox':
      return {
        ...baseConfig,
        label: 'Checkbox Group',
        name: 'checkbox_group',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      };
    case 'radio':
      return {
        ...baseConfig,
        label: 'Radio Group',
        name: 'radio_group',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      };
    case 'date':
      return {
        ...baseConfig,
        label: 'Date',
        name: 'date_field',
      };
    case 'time':
      return {
        ...baseConfig,
        label: 'Time',
        name: 'time_field',
      };
    case 'file':
      return {
        ...baseConfig,
        label: 'File Upload',
        name: 'file_upload',
        accept: '*',
        multiple: false,
      };
    case 'phone':
      return {
        ...baseConfig,
        label: 'Phone',
        placeholder: '(123) 456-7890',
        name: 'phone',
      };
    case 'url':
      return {
        ...baseConfig,
        label: 'URL',
        placeholder: 'https://example.com',
        name: 'url',
      };
    case 'switch':
      return {
        ...baseConfig,
        label: 'Switch',
        name: 'switch_field',
        onLabel: 'On',
        offLabel: 'Off',
      };
    case 'rating':
      return {
        ...baseConfig,
        label: 'Rating',
        name: 'rating',
        placeholder: undefined, // No placeholder for rating fields
        maxRating: 5,
        allowHalf: false,
        icon: 'star',
        // No default value - user must actively select rating
      };
    case 'range':
      return {
        ...baseConfig,
        label: 'Range',
        name: 'range',
        min: 0, // Default range 0-100, user can customize min/max in properties
        max: 100,
        step: 1,
        showValue: true,
      };
    case 'datetime':
      return {
        ...baseConfig,
        label: 'Date & Time',
        name: 'datetime_field',
      };
    case 'daterange':
      return {
        ...baseConfig,
        label: 'Date Range',
        name: 'daterange_field',
        startLabel: 'Start Date',
        endLabel: 'End Date',
      };
    case 'richtext':
      return {
        ...baseConfig,
        label: 'Rich Text',
        name: 'richtext_field',
        toolbar: ['bold', 'italic', 'underline', 'link', 'list'],
      };
    case 'color':
      return {
        ...baseConfig,
        label: 'Color',
        name: 'color_field',
        format: 'hex',
        showInput: true,
      };
    case 'image':
      return {
        ...baseConfig,
        label: 'Image Upload',
        name: 'image_upload',
        accept: 'image/*',
        multiple: false,
      };
    case 'signature':
      return {
        ...baseConfig,
        label: 'Signature',
        name: 'signature_field',
      };
    case 'section':
      return {
        ...baseConfig,
        type: 'section',
        title: 'Section Title',
        collapsible: true,
        collapsed: false,
      };
    case 'alert':
      return {
        ...baseConfig,
        type: 'alert',
        content: 'This is an alert message',
        alertType: 'info',
      };
    case 'header':
      return {
        ...baseConfig,
        type: 'header',
        content: 'Header Text',
        level: 2,
      };
    case 'paragraph':
      return {
        ...baseConfig,
        type: 'paragraph',
        content: 'This is a paragraph of text. You can edit this content.',
      };
    case 'divider':
      return {
        ...baseConfig,
        type: 'divider',
      };
    default:
      return baseConfig;
  }
};
