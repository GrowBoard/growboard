# Test Utils Module

Test helpers, mocking tools, and environment setup scripts to support the Jest test suite in GrowBoard.

## Table of Contents

- [Directory Structure](#directory-structure)
- [How It Works](#how-it-works)
- [Usage](#usage)

## Directory Structure

```
testUtils/
├── customRender.tsx     # Enhanced RTL render function wrapping providers
├── mockData/            # JSON and TS fixtures for testing
└── setupMocks.ts        # API and module level intercepts
```

## How It Works

This module houses utilities that simplify writing tests. Rather than recreating wrapper components or hard-coded mock responses in every test file, test authors should import these shared utilities.

## Usage

When testing components that rely on React Context (like Chakra UI or React Router):

```tsx
import { render } from '@testUtils/customRender';
import { MyComponent } from '../MyComponent';

test('renders properly', () => {
  render(<MyComponent />);
  // proceed with standard RTL assertions
});
```

> [!TIP]
> Ensure any new global Providers added to the main application are also mirrored within `customRender.tsx`.
