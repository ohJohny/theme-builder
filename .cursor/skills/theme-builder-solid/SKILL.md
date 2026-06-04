---
name: ohjohny-theme-builder-solid
description: Solid ThemeProvider, useTheme, useColorScheme from @ohJohny/theme-builder-solid. Use for design tokens and light/dark mode in Solid apps.
---

# @ohJohny/theme-builder-solid

## Setup

```tsx
/** @jsxImportSource solid-js */
import { ThemeProvider, useTheme, useColorScheme, ThemeBuilder } from '@ohJohny/theme-builder-solid';

ThemeBuilder.getInstance().extend({ colors: { brand: 'var(--color-brand)' } });

<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

## Hooks

- `useTheme()` — token tree from singleton
- `useColorScheme()` — accessors: `colorScheme()`, `changeColorScheme`, `colorSchemeList()`
- `useColorSchemeTogglePosition(buttonRef)` — view-transition CSS vars

## CSS

Import your app's theme CSS. No styles ship with this package.

## Peer

`solid-js` >= 1.8. No `lucide-solid` in the provider.
