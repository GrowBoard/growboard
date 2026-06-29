# Screens Module

Top-level page views (screens) for the GrowBoard application, representing the entire visible area associated with a distinct route.

## Table of Contents

- [Directory Structure](#directory-structure)
- [How It Works](#how-it-works)
- [Guidelines](#guidelines)

## Directory Structure

```
screens/
├── dashboard_home/ # Main authenticated dashboard home grid screen
├── settings/       # User and application settings screen
├── login/          # Authentication entry view
├── creds/          # Managed credentials screen
├── expenses/       # Managed expenses register screen
├── goals/          # Managed goals screen
├── learnings/      # Markdown learnings screen
├── resources/      # Google Sheets-backed resources list screen
├── plans/          # Google Sheets-backed plans dashboard screen
├── projects/       # Google Sheets-backed projects dashboard screen
└── static_screen/  # Static and legal screens (404, Privacy, Terms, Data policies)
```

## How It Works

Screens act as the "smart" components orchestrating the overall user experience for a specific route. They bind global state (from `store/`), invoke network requests (from `services/`), and compose smaller reusable "dumb" components (from `components/`).

## Guidelines

- **No generic reuse**: A screen is tightly bound to its domain logic and routing configuration. It should not be used as a child component inside another screen.
- **Lazy Loading**: Where applicable, large screens should be lazy-loaded using `React.lazy()` within the `router/` configuration to minimize the initial bundle size.
