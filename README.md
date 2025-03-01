# SpecScript

Language support for specification files (.spec) in TypeScript projects.

## Features

- Syntax highlighting for .spec files
- VS Code language support
- Spec file validation
- Reserved word definitions
- Auto-indentation and formatting

## Installation

```bash
npm install specscript
```

For VS Code support, also install the SpecScript VS Code extension.

## Usage

Create .spec files in your project:

```specscript
Type: User
  Properties:
    id: required unique identifier
    email: required email
    name: required text
    role: one of [admin, user, guest]
```

## VS Code Integration

The VS Code extension provides:
- Syntax highlighting
- Auto-completion
- Auto-indentation
- Bracket matching
- Comment toggling

## API

```typescript
import { SpecScript } from 'specscript';

const spec = new SpecScript();

// Validate a spec file
const result = spec.validateSpec('path/to/spec.spec');
if (!result.valid) {
  console.error(result.errors);
}
```