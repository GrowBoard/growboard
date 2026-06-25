# Localization Module

i18next translation configurations and locale JSON files for multi-language support in GrowBoard.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [How It Works](#how-it-works)

## Directory Structure

```
localization/
├── locales/
│   ├── en/             # English translations
│   │   ├── common.json
│   │   ├── web.json
│   │   └── error.json
│   ├── es/             # Spanish translations
│   └── hi/             # Hindi translations
├── i18n.ts             # i18next configuration setup
└── README.md
```

## Tech Stack & Dependencies

| Package                            | Version | Purpose                             |
| :--------------------------------- | :------ | :---------------------------------- |
| `react-i18next`                    | 14.1.0  | React bindings for i18next          |
| `i18next`                          | 23.11.2 | Core internationalization framework |
| `i18next-browser-languagedetector` | 7.2.1   | Automatic language detection        |

## How It Works

The module initializes the `i18next` instance and loads translations from `locales/`.

To utilize localization in components, import the `useTranslation` hook:

```tsx
import { useTranslation } from 'react-i18next';

export const Greeting = () => {
  const { t } = useTranslation('common');
  return <h1>{t('greeting')}</h1>; // Renders the localized string
};
```

> [!WARNING]
> Ensure all added translation keys in `en/` are duplicated and localized in all supported language folders to guarantee a safe fallback.
