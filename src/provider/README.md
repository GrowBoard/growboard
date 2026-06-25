# Provider Module

React Context providers designed to wrap the application tree and inject global configurations, themes, and states into the GrowBoard React components.

## Table of Contents

- [Directory Structure](#directory-structure)
- [How It Works](#how-it-works)
- [Usage](#usage)

## Directory Structure

```
provider/
├── ThemeProvider.tsx    # Injects Chakra UI theme context
├── AuthProvider.tsx     # Provides authentication lifecycle to the component tree
├── QueryProvider.tsx    # Wraps the app in React Query client
└── index.ts             # Aggregator for global AppProvider
```

## How It Works

Providers utilize React Context (`React.createContext`) to make data available to any component in the subtree without having to pass props down manually at every level. The aggregator `AppProvider` wraps multiple individual providers in a composed structure so `src/index.tsx` remains clean.

## Usage

Providers are primarily utilized at the top level of the React tree (`src/index.tsx`).

```tsx
import { AppProvider } from '@provider';
import App from './App';

const Root = () => (
  <AppProvider>
    <App />
  </AppProvider>
);
```
