---
name: ohjohny-theme-builder-react
description: React ThemeProvider, useTheme, useColorScheme from @ohJohny/theme-builder-react. Use for design tokens and light/dark mode in React apps.
---

# @ohJohny/theme-builder-react

## Setup

```tsx
import { ThemeProvider, useTheme, useColorScheme, ThemeBuilder } from '@ohJohny/theme-builder-react';

ThemeBuilder.getInstance().extend({ colors: { brand: 'var(--color-brand)' } });

<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

## Hooks

- `useTheme()` — proxy-guarded token tree
- `useColorScheme()` — `colorScheme`, `changeColorScheme`, `colorSchemeList`
- `useColorSchemeTogglePosition(ref)` — syncs view-transition origin CSS vars

## CSS

Import your app's theme CSS (`data-theme` on `:root`). This package does not ship styles.

## Peer

`react` >= 18. No icon library coupling.
