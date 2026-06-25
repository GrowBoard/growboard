# Services Module

API layer, networking components, and integrations with external backend systems for the GrowBoard application.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [How It Works](#how-it-works)

## Directory Structure

```
services/
├── api/            # Base Axios or fetch client configurations
├── supabase/       # Supabase client initialization and helpers
├── endpoints.ts    # Centralized endpoint string constants
└── types.ts        # Global data transfer object (DTO) type definitions
```

## Tech Stack & Dependencies

| Package                 | Version | Purpose                                     |
| :---------------------- | :------ | :------------------------------------------ |
| `axios`                 | 1.8.3   | Promise-based HTTP client for data fetching |
| `@supabase/supabase-js` | 2.39.3  | Official Supabase integration SDK           |

## How It Works

All external network logic should be isolated within this directory. Components and hooks interact with data through service abstractions rather than invoking `fetch` directly.

A typical service pattern exports async functions:

```typescript
import { apiClient } from './api';
import { UserDTO } from './types';

export const fetchUserProfile = async (userId: string): Promise<UserDTO> => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data;
};
```

> [!IMPORTANT]
> The Services layer is responsible for translating raw API responses into safely typed interfaces. Any modifications to API schemas in the backend MUST correspond to an update in `types.ts` here.
