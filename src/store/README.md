# Store Module

Global state management implementations utilizing Zustand for the GrowBoard application.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [How It Works](#how-it-works)
- [State Guidelines](#state-guidelines)

## Directory Structure

```
store/
├── slice/            # Domain slices (Alert, Auth, Creds, Expenses, Goals, Learnings, Projects, Resources)
├── selectors/        # Selector functions for state subscription optimization
├── store/            # Zentral store configuration (appStore.tsx) and type definitions
└── index.ts          # Consolidated store hooks and types exports
```

## Tech Stack & Dependencies

| Package   | Version | Purpose                                    |
| :-------- | :------ | :----------------------------------------- |
| `zustand` | 4.5.2   | Fast, scalable, barebones state management |
| `immer`   | 10.0.4  | Immutable state mutation helpers           |

## How It Works

Store slices represent specific domains of data. They expose state values and actions (functions) to modify that state. State mutations are primarily handled via the standard `set` method.

```typescript
import { create } from 'zustand';

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
```

## State Guidelines

- **Selection**: Always utilize Zustand's selector pattern, preferably combined with `useShallow` when pulling multiple properties, to avoid excessive React renders.
- **Testing**: Global state updates within tests must be executed inside React Testing Library's `act()` wrapper.
