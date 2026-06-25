# Utilities Module

Shared helper functions, formatters, and global constants for use throughout the GrowBoard application.

## Table of Contents

- [Directory Structure](#directory-structure)
- [How It Works](#how-it-works)
- [Guidelines](#guidelines)

## Directory Structure

```
util/
├── formatters.ts    # Date and string manipulations
├── validators.ts    # Shared regex and logic assertions
└── constants.ts     # Global configuration variables
```

## How It Works

Functions placed in `util/` should be completely independent of the React lifecycle (i.e. no Hooks, Context, or JSX elements). They are pure TypeScript functions designed to be imported anywhere.

## Guidelines

- **Purity**: Strive to keep utility functions pure. Given the same inputs, they should always return the same outputs with no side effects.
- **Testing**: Utility functions must be thoroughly unit tested, as they form the foundational logic layer for many other modules.
