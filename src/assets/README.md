# Assets Module

Static assets including SVG icons, images, fonts, and other binary or static files used throughout the GrowBoard application.

## Table of Contents

- [Directory Structure](#directory-structure)
- [How It Works](#how-it-works)
- [Getting Started & Usage](#getting-started--usage)

## Directory Structure

```
assets/
├── icons/       # Reusable SVG icon components and files
├── images/      # Static image files (png, jpg, webp)
└── fonts/       # Custom font files (if locally hosted)
```

## How It Works

Assets are imported directly into React components to ensure Webpack bundles them correctly. We prefer utilizing inline SVG components (or Chakra's `Icon` wrapper) over raw `.svg` files for dynamic color and sizing control.

## Getting Started & Usage

To use an asset in a component:

```tsx
import { ReactComponent as MyIcon } from '@assets/icons/my-icon.svg';
import logoUrl from '@assets/images/logo.png';

export const MyComponent = () => (
  <div>
    <img src={logoUrl} alt="Logo" />
    <MyIcon width="24" height="24" fill="currentColor" />
  </div>
);
```
