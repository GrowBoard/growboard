# GrowBoard

A premium, local-first Stream Deck-style productivity hub. GrowBoard enables users to organize, automate, and scale their workflows using a modular card interface powered entirely by their own personal Google Drive.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [How It Works](#how-it-works)
- [Getting Started & Installation](#getting-started--installation)
- [Testing Guide](#testing-guide)

## Directory Structure

```
growboard/
├── public/                 # Static assets and index.html
├── src/                    # Source code directory
│   ├── assets/             # Reusable SVG icons, images, fonts
│   ├── components/         # Reusable Chakra UI-based UI components
│   ├── hooks/              # Custom React hooks for shared logic
│   ├── localization/       # i18next translation configurations
│   ├── provider/           # React Context providers
│   ├── router/             # React Router v6 configuration
│   ├── screens/            # Top-level page views (Public, Private, Static)
│   ├── services/           # Google Sheets API and local services
│   ├── store/              # Zustand global state slices & persistence
│   ├── testUtils/          # Test helpers, mocks, and setup
│   ├── util/               # Shared helper functions
│   ├── index.tsx           # React DOM entry point
│   └── App.tsx             # App root component
├── scripts/                # Task-specific helper scripts
├── craco.config.js         # CRA Configuration Override
├── package.json            # Project dependencies and scripts
└── yarn.lock               # Yarn lockfile
```

## Tech Stack & Dependencies

| Package                 | Version | Purpose                             |
| :---------------------- | :------ | :---------------------------------- |
| `react`                 | 18.2.0  | Core UI Library                     |
| `react-router-dom`      | 6.21.3  | Client-side routing and navigation  |
| `@chakra-ui/react`      | 3.x     | Modern theme system & UI components |
| `zustand`               | 4.5.2   | Global state management             |
| `@tanstack/react-query` | 5.66.0  | Server-state synchronization        |
| `@craco/craco`          | 7.1.0   | Webpack configuration overrides     |
| `@react-oauth/google`   | 0.13.5  | Google OAuth 2.0 integration        |
| `react-joyride`         | 3.1.0   | Onboarding tour-guide library       |

## How It Works

1. **Initialization**: The application bootstraps from `src/index.tsx`, injecting global providers (Chakra Theme, i18next Localization, Google OAuth).
2. **Routing**: `react-router-dom` orchestrates URL-to-Component mapping through `src/router/routes/AppRouter.tsx`.
   - **Public Routes**: `/` (Landing Page), `/login`, `/privacy`, `/data-policy`, `/terms`
   - **Private Routes**: Protected dashboard console and its sub-widgets (Plans, Projects, Expenses, Credentials, Goals, Learnings, Resources)
3. **State Management**: Zustand handles local state slice synchronization and triggers immediate updates on UI interactions.
4. **Offline-First Persistence**: Core state slices (Credentials, Goals, Learnings, Resources, Plans, and Projects) are persisted to the browser's `localStorage` via Zustand middleware and merged during app load. TanStack Query is configured with `staleTime: Infinity` to prevent redundant network fetches on refresh, while mutations still invalidate queries to trigger immediate background synchronization.
5. **Google Drive Integration**: GrowBoard functions entirely as a serverless frontend app. It writes and reads data directly from single spreadsheets in the user's personal Google Drive:
   - **Resources**: `GrowBoard/Resources/`
   - **Plans**: `GrowBoard/Plans/` (with schedule deadline tracking)
   - **Projects**: `Growboard/Projects/` (supporting Pending, IdeaPhase, Started, and Done status indicators)
   - **Credentials, Goals, & Learnings**: Synced seamlessly to dedicated sheets.
6. **Obsidian Flux Design**: Rebuilt around a dark obsidian theme. The Landing Page and Login Page share a uniform `AnimatedBackground` (twinkling starfields, mesh gradient orbs, and mouse spotlight) with custom IntersectionObserver-powered scroll-reveal animations.

## Getting Started & Installation

### Prerequisites

- Node.js (v18+)
- Yarn package manager

### Configuration

Create a `.env` file in the project root directory. Use the table below for configuration settings:

| Variable                     | Description                                                   | Example Value                       | Required      |
| :--------------------------- | :------------------------------------------------------------ | :---------------------------------- | :------------ |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Client ID for sign-in functionality              | `8570...apps.googleusercontent.com` | Yes           |
| `HTTPS`                      | Enables HTTPS mode for secure local cookies/OAuth redirection | `true`                              | No (Optional) |

### Commands

To run the application locally in development mode:

```bash
yarn install
yarn start
```

For building a production bundle:

```bash
yarn build
```

## Testing Guide

- **Unit/Integration Tests**: Run `yarn test` to execute the Jest suite.
- **Specific Tests**: Run `npx jest path/to/test` to target individual test files.
- **E2E Testing**: Run `yarn cy:open` to launch the Cypress testing dashboard.
