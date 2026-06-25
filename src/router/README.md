# Router Module

React Router v7 configuration and route definitions dictating application navigation and access policies for GrowBoard.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [How It Works](#how-it-works)
- [Route Mapping](#route-mapping)

## Directory Structure

```
router/
├── index.tsx           # Route configurations and RouterProvider wrapper
├── PrivateRoute.tsx    # Authentication guard component
└── paths.ts            # Centralized string constants for URL paths
```

## Tech Stack & Dependencies

| Package            | Version | Purpose                          |
| :----------------- | :------ | :------------------------------- |
| `react-router-dom` | 6.21.3  | Web framework and routing engine |

> [!NOTE]
> Ensure that polyfills for `TextEncoder` and `TextDecoder` are active in Jest environments, as React Router mandates them internally.

## How It Works

Routes are declared using a structural object-based configuration (`createBrowserRouter`) or component-based JSX hierarchy. Authentication logic is enforced by wrapping protected paths inside `<PrivateRoute>`.

## Route Mapping

| Prop name  | Type              | Required | Description                        |
| :--------- | :---------------- | :------- | :--------------------------------- |
| `path`     | `string`          | Yes      | The URL pattern to match           |
| `element`  | `React.ReactNode` | Yes      | The component to render upon match |
| `children` | `RouteObject[]`   | No       | Nested child routes                |
