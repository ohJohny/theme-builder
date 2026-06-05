# @ohJohny/theme-builder

Framework-agnostic design-token runtime with React and Solid providers.

## Install

```bash
npm install @ohJohny/theme-builder
```

Peer dependencies: `react` + `react-dom` for `/react`, `solid-js` for `/solid`.

## Entry points

| Import | Description |
|--------|-------------|
| `@ohJohny/theme-builder/core` | `ThemeBuilder`, `RawThemeBuilder`, utility classes, color-scheme DOM helpers |
| `@ohJohny/theme-builder/react` | `ThemeProvider`, `useTheme`, `useColorScheme`, `useUtilityClasses`, `useDeviceSize` |
| `@ohJohny/theme-builder/solid` | Same surface for Solid |

`@ohJohny/theme-builder` is a shorthand alias for `/core`.

## Quick start (React)

```tsx
import {
  ThemeProvider,
  useTheme,
  useUtilityClasses,
} from '@ohJohny/theme-builder/react';
import {
  ThemeBuilder,
  RawThemeBuilder,
} from '@ohJohny/theme-builder/core';

// Inject CSS variables + utility rules (this package does not ship CSS)
RawThemeBuilder.getInstance().apply(demoThemeConfig);

ThemeBuilder.getInstance().extend({
  colors: { brand: 'var(--color-brand)' },
});

<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

```tsx
function Card() {
  const { className, style } = useUtilityClasses({ px: 'md', py: 'sm', bg: 'surface-main' });
  return <div className={className} style={style}>…</div>;
}
```

## Utility classes

Canonical class names are derived from token types in `packages/core/src/utils/utility-class-catalog.ts` (spacing `px-md`, colors `color-text-primary`, typography `text-lg`, etc.).

### Generate the class map

```bash
# Identity mode (class names match SCSS): px-md → px-md
bun run generate:utility-class-map

# Hashed mode (production obfuscation): px-md → c0-a1b2c3
cd packages/core && bun scripts/generate-utility-class-map.ts --hashed
```

The committed map lives at `packages/core/src/generated/utility-class-map.ts` and exports:

- `UTILITY_CLASS_NAMES` — catalog (single source, no duplicate key/value pairs)
- `UTILITY_CLASS_OVERRIDES` — hashed aliases only (empty in identity mode)
- `UTILITY_CLASS_MAP` — derived lookup

`ThemeBuilder` resolves `.class` fields through `resolveUtilityClass`. For hashed production CSS, run `rewriteUtilityCss` on compiled stylesheets (see `packages/core/src/utils/utility-class-map.ts`). Bump `UTILITY_CLASS_HASH_SALT` in `utility-class-hash.ts` when intentionally invalidating hashed names.

### Add a new utility

1. Extend token constants in `packages/core/src/types/theme.ts` and/or `utility-class-catalog.ts`.
2. Regenerate: `bun run generate:utility-class-map`.
3. Mirror rules in your app SCSS or use `RawThemeBuilder.apply()` for runtime CSS.

## TypeScript: extend theme in a consumer repo

```ts
// theme-augmentation.d.ts
import '@ohJohny/theme-builder/core';

declare module '@ohJohny/theme-builder/core' {
  interface ThemeColorOverrides {
    brand: string;
    'brand-muted': string;
  }
  interface SemanticColorTokenOverrides {
    'brand-accent': never;
  }
}
```

After `ThemeBuilder.getInstance().extend({ colors: { brand: 'var(--color-brand)' } })`, `useTheme().colors.brand` is typed. `ThemeBuilder.subscribe()` notifies React/Solid providers when the tree changes.

## Agent skills

Skills install to `.cursor/skills/` on `bun install` (monorepo root) and when consumers install `@ohJohny/theme-builder` (`postinstall` uses `INIT_CWD`).

Canonical sources: `packages/*/skills/`. Sync copies: `.cursor/skills/`.

```bash
bun run sync:cursor-skills
```

## Playground

```bash
bun run dev:playground
```

Interactive token showcase at `examples/playground/` (Vite + React).

## Build

```bash
bun install
bun run build
bun run test
```

## Monorepo layout

Published artifact: `@ohJohny/theme-builder` (`packages/theme-builder`).

Workspace-only packages (`packages/core`, `packages/react`, `packages/solid`) are built into `dist/` and bundled by the umbrella package. They are not published separately.
