# @formmorf/builder

A powerful, enterprise-ready React form builder library with drag-and-drop functionality, responsive previews, and comprehensive validation.

## Features

- 🎯 **Drag-and-Drop Interface** - Intuitive form building with @dnd-kit
- 📱 **Responsive Preview** - Desktop, tablet, and mobile device previews
- ✅ **Comprehensive Validation** - Built-in and custom validators
- 🎨 **Material-UI Components** - Modern, accessible UI
- 📦 **Type-Safe** - Full TypeScript support
- 🔧 **Flexible API** - Easy integration and customization
- 🎭 **Form Viewer** - Separate runtime component for form rendering

## Installation

```bash
npm install @formmorf/builder
# or
pnpm add @formmorf/builder
# or
yarn add @formmorf/builder
```

### Peer Dependencies

```bash
npm install react react-dom immer
```

## Quick Start

### Basic Form Builder

```tsx
import { FormBuilder } from '@formmorf/builder';

function App() {
  const handleSave = (schema) => {
    console.log('Form schema:', schema);
    // Save schema to your backend
  };

  return (
    <FormBuilder
      onSave={handleSave}
      initialSchema={{
        title: 'My Form',
        description: 'Form description',
        fields: []
      }}
    />
  );
}
```

### Form Viewer (Runtime)

```tsx
import { FormViewer } from '@formmorf/builder';

function FormDisplay({ schema }) {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormViewer
      schema={schema}
      onSubmit={handleSubmit}
    />
  );
}
```

## Supported Field Types

- **Text** - Single-line text input
- **Textarea** - Multi-line text input
- **Number** - Numeric input
- **Email** - Email input with validation
- **Phone** - Phone number input
- **Date** - Date picker
- **Time** - Time picker
- **Select** - Dropdown selection
- **Radio** - Radio button group
- **Checkbox** - Single or grouped checkboxes
- **File** - File upload
- **Rating** - Star rating component
- **Heading** - Static heading text
- **Paragraph** - Static paragraph text

## API Reference

### FormBuilder Props

```typescript
interface FormBuilderProps {
  initialSchema?: FormSchema;
  onSave?: (schema: FormSchema) => void;
  readOnly?: boolean;
}
```

### FormViewer Props

```typescript
interface FormViewerProps {
  schema: FormSchema;
  onSubmit?: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
}
```

### FormSchema Type

```typescript
interface FormSchema {
  title: string;
  description: string;
  fields: FieldDefinition[];
}

interface FieldDefinition {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  validation?: FieldValidation;
  style?: FieldStyle;
  // ... type-specific properties
}
```

## Advanced Usage

### Custom Validation

```tsx
import { createCustomValidator } from '@formmorf/builder';

const customValidator = createCustomValidator(
  (value) => value.length >= 10,
  'Must be at least 10 characters'
);

const schema = {
  fields: [{
    id: '1',
    type: 'text',
    label: 'Username',
    validation: {
      custom: [customValidator]
    }
  }]
};
```

### Device Preview Switcher

```tsx
import { DevicePreviewSwitcher } from '@formmorf/builder';

function CustomPreview() {
  const [device, setDevice] = useState('desktop');

  return (
    <>
      <DevicePreviewSwitcher
        currentDevice={device}
        onDeviceChange={setDevice}
      />
      {/* Your preview content */}
    </>
  );
}
```

### Using the Form Store

```tsx
import { useFormStore } from '@formmorf/builder';

function CustomComponent() {
  const { schema, addField, updateField } = useFormStore();

  // Direct store access for advanced use cases
}
```

## Styling

The library includes default Material-UI styling. Import the CSS in your app:

```tsx
import '@formmorf/builder/dist/style.css';
```

## TypeScript Support

Full TypeScript definitions are included. Import types as needed:

```tsx
import type {
  FormSchema,
  FieldDefinition,
  FieldType,
  ValidationError
} from '@formmorf/builder';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © FormMorf Contributors

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and feature requests, please use the GitHub issue tracker.
