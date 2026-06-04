---
name: ohjohny-theme-builder-core
description: Framework-agnostic ThemeBuilder, RawThemeBuilder, color-scheme DOM helpers, and createColorSchemeStore from @ohJohny/theme-builder-core. Use for design tokens, CSS variables, and headless light/dark switching.
---

# @ohJohny/theme-builder-core

## ThemeBuilder singleton

```ts
import { ThemeBuilder, RawThemeBuilder } from '@ohJohny/theme-builder-core';

ThemeBuilder.getInstance().extend({
  colors: { brand: 'var(--color-brand)' },
});

RawThemeBuilder.getInstance().apply({
  colors: { 'brand-primary': '#0066cc' },
});

const theme = ThemeBuilder.getInstance().getTheme();
theme.spacing.p.md.class;
theme.spacing.p.md.value;
```

Call `extend()` / `apply()` before rendering UI so providers see the merged tree.

## Color scheme (headless)

```ts
import { createColorSchemeStore, applyColorScheme } from '@ohJohny/theme-builder-core';

const store = createColorSchemeStore({
  presetColorScheme: 'light',
  storage: { type: 'localStorage', key: 'app-theme' },
});

store.subscribe(() => console.log(store.getState().colorScheme));
store.changeColorScheme('dark');
```

`applyColorScheme` sets `data-theme` on `:root`. Pair with your app's CSS (not shipped here).

## Utilities

- `resolveUtilityClass`, `UTILITY_CLASS_MAP` — hashed class names
- `updateColorSchemeTogglePosition`, `startColorSchemeViewTransition`
