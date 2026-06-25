# CLAUDE.md

This file provides a high-level entry point for Claude-based tools working in the **GrowBoard** repository.

## Overview

This is a **React Web Application** (using Craco for configuration) representing the GrowBoard productivity tool platform.

- **Web Framework**: React 18.3+
- **Styling**: Chakra UI (Geist/Hanken Grotesk typography, Obsidian Flux brand colors)
- **State Management**: Zustand, React Query

## 📘 Primary Documentation

For comprehensive technical documentation, architectural decisions, file conventions, and agent-specific skills, always refer to the Agent Guide section:

👉 **[Agent Guide](#AGENT)**

## 💻 Code Style Guidelines

- **React Components**: Avoid using `React.FC` or `React.FunctionComponent` to define functional components. Instead, type props directly in the function arguments: `const MyComponent = ({ prop1 }: Props) => { ... }`.

## Essential Commands

These are the most common commands for development:

```bash
yarn install                   # Install all dependencies

yarn start                     # Start web local development server
yarn build                     # Create production build for web
yarn test                      # Run Jest tests for web
yarn lint                      # Run ESLint for web
yarn cy:open                   # Run E2E tests

make commit                    # Conventional commit helper
```

## Antigravity Skills

Advanced agent instructions are modularized in the `.claude/skills/` directory.

- [Commit Workflow](file:///Users/mr.robot/z-stash/Growboard/growboard/.claude/skills/commit/SKILL.md)
- [Jira Management](file:///Users/mr.robot/z-stash/Growboard/growboard/.claude/skills/jira/SKILL.md)
- [Pull Request Skill](file:///Users/mr.robot/z-stash/Growboard/growboard/.claude/skills/pr/SKILL.md)
- [Frontend Design](file:///Users/mr.robot/z-stash/Growboard/growboard/.claude/skills/frontend-design/SKILL.md)
- [Web Development](file:///Users/mr.robot/z-stash/Growboard/growboard/.claude/skills/web/SKILL.md)
- [README Guidelines](file:///Users/mr.robot/z-stash/Growboard/growboard/.claude/skills/readme/SKILL.md)

## 🌐 Localization Guidelines

All user-facing copy strings (headings, paragraphs, labels, button texts, tooltips, placeholders, etc.) MUST be defined in the localization JSON files located in `src/localization/locales/` (`client.json`, `web.json`, `common.json`, and `error.json` under each locale directory) and retrieved dynamically in code using the `useTranslation` hook (`t('key')`). Never hardcode text strings directly in component files.

Always ensure that any newly added or updated translation keys are copied and synchronized across all supported languages (`en/`, `hi/`, `es/`, `ru/`, `zh/`, `ja/`) to guarantee proper fallback resolution.

## 🧪 Testing Guidelines

Always add or update the unit tests (and their snapshots) to align with the requested feature implementations or changes. Run the test suite using `yarn test` to verify that all changes are fully covered, correct, and pass successfully.

---

# AGENT

This section serves as the primary source of truth for AI agents working on the **GrowBoard** project. It provides architectural context, directory structures, and established development patterns.

## 1. Project Overview

| Core Stack           | Technology                                                    |
| :------------------- | :------------------------------------------------------------ |
| **Framework (Web)**  | [React 18.3+](https://react.dev/)                             |
| **UI Library**       | [Chakra UI v3](https://chakra-ui.com/)                        |
| **State Management** | [Zustand v5](https://zustand.docs.pmnd.rs/)                   |
| **Routing**          | [React Router v7](https://reactrouter.com/)                   |
| **Styling**          | Vanilla CSS + Chakra UI v3                                    |
| **Language**         | [TypeScript 5.x](https://www.typescriptlang.org/)             |
| **Testing**          | Jest + React Testing Library (v16+) + Cypress                 |
| **Package Manager**  | [Yarn 4 (Berry)](https://yarnpkg.com/)                        |
| **Aesthetic**        | Modern, premium, glassmorphism overlays, dynamic design       |
| **Brand Colors**     | Obsidian Flux theme (Background `#121416`, Primary `#bac8d7`) |

## 2. Design & Product Identity

### Visual Language

- **Theme**: Dark mode by default. High contrast with subtle grain textures and glassmorphic overlays (Obsidian Flux).
- **Typography**: Geist (Sans-serif) for headings, Hanken Grotesk for body, JetBrains Mono for code.
- **Components**: Crisp border-based separation and interactive micro-animations.

### Product Purpose

GrowBoard is a productivity tool web application.

## 3. Directory Structure

```text
/
├── .claude/                # Agent skills and settings
├── .github/                # CI/CD Workflows (Web CI, Build & Publish)
├── public/                 # Static assets and index.html
├── src/                    # Source code (React components, state, hooks, pages, etc.)
├── scripts/                # Task-specific helper scripts
├── package.json            # Project configuration
└── yarn.lock               # Yarn lockfile
```

## 4. Development Patterns & Rules

### State Management (Zustand v5)

- **Selectors**: Always use `useShallow` when selecting multiple state variables to prevent unnecessary re-renders.
- **Testing**: State updates within tests MUST be wrapped in `act()` from `@testing-library/react`.
- **Resetting**: Stores should implement a `reset` pattern for test isolation (see `__mocks__/zustand.ts`).

### UI & Styling (Chakra v3)

- **Compound Components**: Use the standard v3 pattern (e.g., `<Dialog.Root>`, `<Menu.Content>`).
- **Icons**: Use inline SVGs or define local custom SVG components directly within the files where they are needed.
- **Theme**: Tokens are managed in `src/components/Theme/theme.ts`. Avoid hardcoded colors.

### Routing (React Router v7)

- Use standard `<Link>` and `useNavigate`.
- Note: `TextEncoder` and `TextDecoder` polyfills in `jest.js` are required for RRv7 compatibility in JSDOM environments.

### TypeScript

- All files use `.ts` or `.tsx`.
- Strictly adhere to path aliases defined in `tsconfig.path.json` (e.g., `@screens`, `@components`, `@store`).

## 5. Testing & Verification

- **Unit/Integration**: `yarn test`
  - Snapshots are located in `__snapshots__` directories adjacent to tests.
  - RTL `renderHook` is natively imported from `@testing-library/react`.
- **E2E**: `yarn cy:open`
- **Build**: `yarn build` (Always verify build compatibility after dependency updates).

## 6. Agent Workflow

1.  **Understand**: Review this file and `.claude/CLAUDE.md`.
2.  **Verify**: Always run `yarn lint` and `yarn test` before declaring a task complete.
3.  **Documentation**: Always check if a README update is required for any modified components. If so, update the corresponding `README.md` following the guidelines in the [readme skill](file:///Users/mr.robot/z-stash/Growboard/growboard/.claude/skills/readme/SKILL.md).
4.  **Governance**: Follow Conventional Commits and link all changes to the **GrowBoard** Jira project using `prefix/GRW-XXX` branch naming.

---

© 2026 GrowBoard | Confidential and Proprietary
