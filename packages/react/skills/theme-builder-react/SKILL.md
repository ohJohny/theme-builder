---
name: ohjohny-theme-builder-react
description: React ThemeProvider, useTheme, useColorScheme from @ohJohny/theme-builder-react. Use for design tokens and light/dark mode in React apps.
---

# @ohJohny/theme-builder-react

## Setup

```tsx
import {
  ThemeProvider,
  useTheme,
  useColorScheme,
  useUtilityClasses,
  ThemeBuilder,
  RawThemeBuilder,
} from '@ohJohny/theme-builder-react';

RawThemeBuilder.getInstance().apply(yourThemeConfig);

ThemeBuilder.getInstance().extend({ colors: { brand: 'var(--color-brand)' } });

<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

## Hooks

- `useTheme()` — proxy-guarded token tree (updates after `extend()`)
- `useColorScheme()` — `colorScheme`, `changeColorScheme`, `colorSchemeList`
- `useUtilityClasses({ px: 'md', bg: 'surface-main' })` — `{ className, style }`
- `useColorSchemeTogglePosition(ref)` — view-transition origin CSS vars

## Utility props example

```tsx
function Box() {
  const { className, style } = useUtilityClasses({
    px: 'md',
    py: 'sm',
    color: 'text-primary',
    fontSize: 'lg',
  });
  return <div className={className} style={style} />;
}
```

## CSS

Import or inject theme CSS (`RawThemeBuilder.apply`). Style `[data-theme="dark"]` on `:root`. This package does not ship styles.

## TypeScript extension

Augment `@ohJohny/theme-builder-core` interfaces `ThemeColorOverrides` / `SemanticColorTokenOverrides` in a `.d.ts` file.

## Peer

`react` >= 18. No icon library coupling.
