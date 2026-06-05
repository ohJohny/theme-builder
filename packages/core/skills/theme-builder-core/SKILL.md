---
name: ohjohny-theme-builder-core
description: Framework-agnostic ThemeBuilder, RawThemeBuilder, color-scheme DOM helpers, and createColorSchemeStore from @ohJohny/theme-builder/core. Use for design tokens, CSS variables, and headless light/dark switching.
---

# @ohJohny/theme-builder/core

## ThemeBuilder singleton

```ts
import { ThemeBuilder, RawThemeBuilder } from '@ohJohny/theme-builder/core';

RawThemeBuilder.getInstance().apply({ colors: { 'text-primary': '#111' } });

ThemeBuilder.getInstance().extend({
  colors: { brand: 'var(--color-brand)' },
});

const theme = ThemeBuilder.getInstance().getTheme();
theme.spacing.px.md.class; // resolved utility class (identity or hashed)
theme.spacing.px.md.value; // var(--space-md)
```

`ThemeBuilder.subscribe()` fires after `extend()`. Pair with framework providers for live updates.

## TypeScript extension (consumer repo)

```ts
// theme-augmentation.d.ts
declare module '@ohJohny/theme-builder/core' {
  interface ThemeColorOverrides { brand: string }
  interface SemanticColorTokenOverrides { 'brand-accent': never }
}
```

## Utility classes

1. Catalog: `collectUtilityClassNames()` in `utility-class-catalog.ts` (from token constants).
2. Generate: `bun run generate:utility-class-map` (identity) or `bun scripts/generate-utility-class-map.ts --hashed` in `packages/core`.
3. Runtime: `resolveUtilityClass('px-md')` uses `UTILITY_CLASS_MAP` (built from `UTILITY_CLASS_NAMES` + `UTILITY_CLASS_OVERRIDES`).
4. Hashed CSS: `rewriteUtilityCss(css, map)`; salt in `UTILITY_CLASS_HASH_SALT`.

## resolveUtilityClasses

```ts
import { resolveUtilityClasses } from '@ohJohny/theme-builder/core';

const { className, style } = resolveUtilityClasses(
  { px: 'md', color: 'text-primary', bg: '#fff' },
  theme,
);
// px/md → utility class; raw bg → inline style
```

## Color scheme (headless)

```ts
import { createColorSchemeStore, applyColorScheme } from '@ohJohny/theme-builder/core';

const store = createColorSchemeStore({
  presetColorScheme: 'light',
  storage: { type: 'localStorage', key: 'app-theme' },
});
store.changeColorScheme('dark');
```

`applyColorScheme` sets `data-theme` on `:root`. Pair with your app's CSS (not shipped here).

## Other utilities

- `updateColorSchemeTogglePosition`, `startColorSchemeViewTransition`
- `resolveColorPresentation`, `resolveFontPresentation`
