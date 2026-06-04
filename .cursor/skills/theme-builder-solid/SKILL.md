---
name: ohjohny-theme-builder-solid
description: Solid ThemeProvider, useTheme, useColorScheme from @ohJohny/theme-builder-solid. Use for design tokens and light/dark mode in Solid apps.
---

# @ohJohny/theme-builder-solid

## Setup

```tsx
/** @jsxImportSource solid-js */
import {
  ThemeProvider,
  useTheme,
  useColorScheme,
  useUtilityClasses,
  ThemeBuilder,
  RawThemeBuilder,
} from '@ohJohny/theme-builder-solid';

RawThemeBuilder.getInstance().apply(yourThemeConfig);

ThemeBuilder.getInstance().extend({ colors: { brand: 'var(--color-brand)' } });

<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

## Hooks

- `useTheme()` — token tree from singleton (reactive after `extend()`)
- `useColorScheme()` — accessors: `colorScheme()`, `changeColorScheme`, `colorSchemeList()`
- `useUtilityClasses(() => ({ px: 'md' }))` — accessor `() => { className, style }`
- `useColorSchemeTogglePosition(buttonRef)` — view-transition CSS vars

## Utility props example

```tsx
function Box() {
  const utility = useUtilityClasses({ px: 'md', bg: 'surface-main' });
  return <div class={utility().className} style={utility().style} />;
}
```

## CSS

Inject theme CSS via `RawThemeBuilder.apply`. No styles ship with this package.

## TypeScript extension

Augment `@ohJohny/theme-builder-core` in a consumer `.d.ts` file.

## Peer

`solid-js` >= 1.8.
