# Components Module

Reusable Chakra UI-based UI components that follow the Obsidian Flux brand design system for the GrowBoard application.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [How It Works](#how-it-works)
- [Props & Interfaces](#props--interfaces)

## Directory Structure

```
components/
├── Theme/       # Chakra UI theme overrides and tokens
├── Button/      # Custom styled buttons
├── Card/        # Layout and container components
└── index.ts     # Centralized exports
```

## Tech Stack & Dependencies

| Package            | Version | Purpose                                 |
| :----------------- | :------ | :-------------------------------------- |
| `@chakra-ui/react` | 2.8.2   | Component primitives and styling engine |
| `@emotion/react`   | 11.14.0 | Styled components and CSS-in-JS         |
| `framer-motion`    | 11.1.9  | Micro-animations and transitions        |

## How It Works

Components in this directory are purely presentational and mostly stateless (or manage only local UI state). They receive data and callbacks via props. We utilize Chakra's compound component pattern where applicable to improve flexibility.

## Props & Interfaces

A typical interface definition for a component:

| Prop name    | Type                              | Required | Description                   |
| :----------- | :-------------------------------- | :------- | :---------------------------- |
| `variant`    | `'solid' \| 'outline' \| 'ghost'` | No       | Visual style of the component |
| `size`       | `'sm' \| 'md' \| 'lg'`            | No       | Dimensions                    |
| `isDisabled` | `boolean`                         | No       | Prevents user interaction     |

```typescript
export interface BaseComponentProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
}
```
