---
name: unit_test
description: Agent responsible for writing unit tests for all business and UI code, enforcing Jest / React Testing Library best practices, and ensuring code coverage meets the 80% threshold.
trigger: /test
---

# Unit Test Agent

This agent ruleset defines the standard responsibilities and workflows for writing, running, and managing unit and integration tests in the **GrowBoard** project.

## 1. Core Objectives

- Ensure that all business logic (utils, helpers, state stores, hooks) and UI components (screens, reusable elements) are covered by robust tests.
- Maintain a minimum code coverage threshold of **80%** (enforced by `jest.config.js`) across statements, branches, functions, and lines.

## 2. Test File Conventions (from rules.md & CLAUDE.md)

- **Folder Location**: Test files MUST always be placed in a `__tests__/` folder inside the directory containing the code under test (e.g., `utils/__tests__/myUtil.test.ts` instead of `utils/myUtil.test.ts`).
- **Naming**: Test files must be named after the source file they target:
  - Component under test: `ComponentName.tsx` -> `__tests__/ComponentName.test.tsx`
  - Utility under test: `util.ts` -> `__tests__/util.test.ts`
  - Store/Hook under test: `useFeature.ts` -> `__tests__/useFeature.test.ts`
- **Assertions**: No empty or skipped-only test files are allowed. Every test file must contain at least one meaningful assertion.

## 3. Best Practices for UI Component Testing

- Use **React Testing Library** (`@testing-library/react`) for testing components.
- **Render Setup**: Wrap components in necessary providers (like Chakra's provider, custom `Theme` providers, `BrowserRouter`, `HelmetProvider`, `QueryClientProvider` / TanStack query) if they consume context. Use any custom helper `render` or `renderWithProviders` if available.
- **Queries**: Prefer `screen.getByRole` or `screen.getByText` to query elements, simulating real user visibility.
- **User Interactions**: Use `userEvent` (preferred) or `fireEvent` to simulate interactions like clicks, inputs, and mouse hovers.
- **Theming**: Ensure components use semantic tokens (e.g., `bg.card`, `border.subtle`) rather than hardcoded hex colors, and test theme compatibility if appropriate.
- **Snapshot Testing**: Use `toMatchSnapshot()` for static elements to track unexpected DOM changes. Snapshots are stored in `__snapshots__` directories adjacent to tests.

## 4. Best Practices for Business Logic & Utilities

- Cover normal execution paths, edge cases (empty inputs, null values), and error handling paths.
- Mock external APIs (e.g., Axios client, Supabase, localStorage) and side effects to keep tests isolated and deterministic.
- For **Zustand v5** stores:
  - Reset the store state before/after each test run to prevent state pollution across tests (refer to `__mocks__/zustand.ts`).
  - State updates within tests MUST be wrapped in `act()` from `@testing-library/react`.
  - Use `useShallow` when selecting multiple state variables.

## 5. Workflow Steps

When invoked with `/test`, the agent MUST follow these steps:

1. **Identify Coverage Gaps**: Check the latest test coverage report (e.g., by running `yarn test:cov`) to find components/files below the 80% threshold.
2. **Write Unit Tests**: Write high-quality tests adhering to the conventions above.
3. **Verify and Format**:
   - Run `yarn prettier:write` to format the newly added test files.
   - Run `yarn lint` or `yarn lint:fix` to ensure no linting errors are introduced.
4. **Enforce 80% Coverage Threshold**:
   - Run `yarn test:cov` to check the updated coverage.
   - Ensure the coverage threshold matches or exceeds 80%. If not, continue adding missing test cases.
