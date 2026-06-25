# Hooks Module

Custom React hooks encapsulating shared logic, side-effects, and integrations for use across various components and screens in GrowBoard.

## Table of Contents

- [Directory Structure](#directory-structure)
- [How It Works](#how-it-works)
- [Testing](#testing)

## Directory Structure

```
hooks/
├── useAuth.ts          # Authentication lifecycle hook
├── useWindowSize.ts    # Responsive dimensions hook
└── useDebounce.ts      # Utility hook for delayed execution
```

## How It Works

Hooks follow the "rules of hooks". They are strictly used to compose state and lifecycle methods. They may access the global `store/` via Zustand or interact with `services/` via React Query.

## Testing

When testing hooks, use `renderHook` from `@testing-library/react`. Ensure that state updates within tests are wrapped in `act()`.

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```
