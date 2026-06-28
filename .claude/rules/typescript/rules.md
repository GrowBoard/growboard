---
glob: src/**/*.{ts,tsx}
---

# TypeScript & React Component Rules

## Context
These rules govern all TypeScript and React component code within the repository to ensure strict type safety, clean folder structures, uniform naming conventions, and compliance with the project's UI standards.

## Rules

### 1. Type Safety
- **No `any`**: The use of `any` (both as a type annotation and as a type assertion like `as any`) is **totally prohibited**. All code must be strictly and explicitly typed or rely on correct TypeScript type inference.

### 2. Imports Management
- **No Unused Imports**: Always remove all unused imports immediately after adding or modifying any code. Keep imports clean and sorted.

### 3. Component Design & Extensions
- **Single Component per File**: Each `.tsx` file MUST contain exactly a single React component.
- **Component Syntax**: Write all components as arrow functions using the following syntax:
  ```tsx
  const ComponentName = ({ prop1 }: ComponentNameProps) => {
    // ...
  };
  ```
- **React.FC Avoidance**: Never use `React.FC` or `React.FunctionComponent`. Type props directly in the parameters.
- **Component Naming**: Component names must be in `PascalCase`.

### 4. Folder Layout & Components Separation
- **Component Sub-folders**: If a component has complex layout or sub-sections, break it down into smaller sub-components. Place these sub-components in a `components/` subfolder inside the component's folder.
- **No Nested Components Folders**: The `components/` subfolder **cannot be nested** (i.e. you cannot have a `components/` folder inside another `components/` folder).
- **Scope of Sub-components**: The `components/` subfolder must only contain sub-components specific to the parent component.
- **Common Components**: If a component is reusable/common across screens, it must be placed in `src/components/`.
- **Index Exports**: Every directory (including `components/` subfolders) MUST contain an `index.ts` file that manages and routes all exports. Exports must always be done through this `index.ts` file.

### 5. UI Library Compliance (Chakra UI)
- **Chakra UI Only**: We **cannot use UI components other than what is offered by Chakra UI** for visual controls, inputs, layout grids, or structure. Do not import UI controls from other component libraries.

### 6. Separation of Logic & Utils
- **Business/Non-TSX Logic**: Move all helper functions, calculations, or non-TSX business logic into a `util.ts` file in the corresponding component/screen folder.
- **Common Utilities**: Reusable utility functions must be placed in `src/util/`.
- **Redundancy Checks**: Always inspect `src/components/` and `src/util/` before adding any new component or helper function to prevent redundant code.

### 7. Variables & Constants Naming
- **Constants**: Always name constants in `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`, `DEFAULT_STATUS`). Move constants to a `const.ts` file in the corresponding folder.
- **Variables**: Always name variables (local variables, function arguments, state keys) in `camelCase`.

### 8. Documentation Standards
- **JSDoc Requirement**: Always document all components, interfaces/types, utility functions, and constants with clear JSDoc comments.
- **Inline Comments**: Provide inline comments for any complex blocks, math formulas, or non-obvious logic to explain the intent and behavior.

### 9. Testing Requirements
- **Mandatory Tests**: Every component, utility function, and service/business logic module **MUST** have accompanying tests.
- **Test Location**: Tests must be placed in a `__tests__/` folder inside the corresponding component or module folder. Do **not** place test files alongside source files.
- **Test File Naming**: Name test files after the source file they test, with a `.test.ts` or `.test.tsx` suffix (e.g., `ProfileForm.test.tsx`, `util.test.ts`).
- **Coverage Scope**:
  - **Components** (`.tsx`): Test rendering, user interactions, and prop variations using React Testing Library.
  - **Utility functions** (`util.ts`): Test all exported functions with unit tests covering normal cases, edge cases, and error paths.
  - **Business logic / Services**: Test all public methods with mocked dependencies.
- **No Empty Test Files**: Every test file must contain at least one meaningful test assertion. Placeholder or skipped-only test files are not allowed.

---

## Examples

### Correct Component Folder Structure
```text
profile_setting/
├── index.ts
├── ProfileSettingScreen.tsx
├── types.ts
├── const.ts
├── util.ts
├── __tests__/
│   ├── ProfileSettingScreen.test.tsx
│   └── util.test.ts
└── components/
    ├── index.ts
    ├── ProfileForm.tsx
    └── __tests__/
        └── ProfileForm.test.tsx
```

#### profile_setting/index.ts:
```typescript
/**
 * Export default component from the folder.
 */
export { default } from './ProfileSettingScreen';
```

#### profile_setting/components/index.ts:
```typescript
/**
 * Export the ProfileForm component.
 */
export { ProfileForm } from './ProfileForm';
```

#### profile_setting/types.ts:
```typescript
/**
 * Props for the ProfileForm component.
 */
export interface ProfileFormProps {
  initialData: any;
  name: string;
}
```

#### profile_setting/const.ts:
```typescript
/**
 * Maximum character limit for user bio.
 */
export const MAX_BIO_CHAR_LIMIT = 150;
```

#### profile_setting/util.ts:
```typescript
/**
 * Filters empty or whitespace-only phone numbers from a list.
 * @param phoneNumbers List of phone numbers to clean.
 * @returns Filtered array containing valid numbers.
 */
export const filterValidPhoneNumbers = (phoneNumbers: string[]): string[] => {
  return phoneNumbers.filter((phone) => phone.trim() !== '');
};
```

#### profile_setting/ProfileSettingScreen.tsx:
```tsx
import { Box } from '@chakra-ui/react';
import { ProfileForm } from './components';
import { ProfileFormProps } from './types';

/**
 * Renders the main Profile Setting Screen.
 * @param props The screen component props.
 */
const ProfileSettingScreen = ({ initialData, name }: ProfileFormProps) => {
  return (
    <Box>
      <ProfileForm initialData={initialData} name={name} />
    </Box>
  );
};

export default ProfileSettingScreen;
```

#### profile_setting/components/ProfileForm.tsx:
```tsx
import { Box, Input } from '@chakra-ui/react';
import { ProfileFormProps } from '../types';
import { MAX_BIO_CHAR_LIMIT } from '../const';

/**
 * Renders the profile input form.
 * @param props Component properties.
 */
export const ProfileForm = ({ initialData, name }: ProfileFormProps) => {
  // Component logic...
  return (
    <Box>
      <Input placeholder={name} maxLength={MAX_BIO_CHAR_LIMIT} />
    </Box>
  );
};
```

#### profile_setting/\_\_tests\_\_/util.test.ts:
```typescript
import { filterValidPhoneNumbers } from '../util';

describe('filterValidPhoneNumbers', () => {
  it('returns only non-empty phone numbers', () => {
    expect(filterValidPhoneNumbers(['+1234', '', '  '])).toEqual(['+1234']);
  });

  it('returns an empty array when all entries are blank', () => {
    expect(filterValidPhoneNumbers(['', ' '])).toEqual([]);
  });

  it('returns all entries when all are valid', () => {
    const input = ['+1', '+2'];
    expect(filterValidPhoneNumbers(input)).toEqual(input);
  });
});
```

#### profile_setting/components/\_\_tests\_\_/ProfileForm.test.tsx:
```tsx
import { render, screen } from '@testing-library/react';
import { ProfileForm } from '../ProfileForm';

describe('ProfileForm', () => {
  it('renders the name placeholder', () => {
    render(<ProfileForm name="John" initialData={null} />);
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
  });
});
```