# FormMorf

Enterprise React Form Builder Library with drag-and-drop functionality, responsive previews, and comprehensive validation.

[![npm version](https://img.shields.io/npm/v/@formmorf/builder.svg)](https://www.npmjs.com/package/@formmorf/builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Drag-and-Drop Interface**: Intuitive form building with [@dnd-kit](https://dndkit.com/)
- **Rich Component Library**: Text fields, dropdowns, checkboxes, radio buttons, date pickers, file uploads, and more
- **Real-time Preview**: Instant responsive preview across desktop, tablet, and mobile views
- **Advanced Validation**: Built-in validation rules with custom error messaging
- **Conditional Logic**: Show/hide fields based on user input
- **Material-UI Integration**: Beautiful, accessible components out of the box
- **TypeScript Support**: Full type safety and IntelliSense
- **State Management**: Powered by Zustand for efficient state handling

## Installation

```bash
npm install @formmorf/builder
# or
pnpm add @formmorf/builder
# or
yarn add @formmorf/builder
```

## Quick Start

```tsx
import { FormBuilder } from '@formmorf/builder';

function App() {
  return <FormBuilder />;
}
```

## Documentation

Visit [https://formmorf-website.vercel.app/](https://formmorf-website.vercel.app/) for full documentation and examples.

## Repository Structure

```
formmorf/
├── packages/
│   └── builder/          # Main form builder library
├── examples/
│   └── showcase/         # Demo application
└── README.md
```

## Development

This is a monorepo managed with pnpm workspaces.

### Prerequisites

- Node.js 16+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Run development mode (all packages)
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Working with the Builder Package

```bash
cd packages/builder

# Development mode with watch
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## Publishing

To publish a new version of the npm package:

```bash
cd packages/builder

# Update version (patch/minor/major)
npm version patch

# Build the package
pnpm build

# Publish to npm
npm publish --access public

# Push changes and tags
git push && git push --tags
```

## License

MIT © FormMorf Contributors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

Report issues at [https://github.com/Mkaifkazi/formmorf/issues](https://github.com/Mkaifkazi/formmorf/issues)

## Author

Mohammad Kaif Kazi
