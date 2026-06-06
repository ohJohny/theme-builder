# @ohJohny/theme-builder

Framework-agnostic, config-first design tokens with React and Solid providers.

## Install

```bash
npm install @ohJohny/theme-builder
```

Peer dependencies: `react` + `react-dom` for `/react`, `solid-js` for `/solid`.

## Entry points

| Import | Description |
|--------|-------------|
| `@ohJohny/theme-builder/core` | `defineThemeConfig`, `createTheme`, utility resolution, color-scheme store |
| `@ohJohny/theme-builder/core/build-utils` | `generateThemeArtifacts`, `buildThemeStylesheet`, `rewriteUtilityCss` |
| `@ohJohny/theme-builder/react` | `createThemeContext`, `ThemeProvider`, hooks |
| `@ohJohny/theme-builder/solid` | Same surface for Solid |

## Quick start

### 1. Define your theme (BYO — no shipped preset)

```ts
// src/theme/theme.config.ts
import { defineThemeConfig } from '@ohJohny/theme-builder/core';

export const themeConfig = defineThemeConfig({
  schemes: ['light', 'dark'] as const,
  colors: {
    base: { white: '#fff', black: '#000' },
    semantic: {
      'text-primary': { light: '#111', dark: '#eee' },
      'surface-main': { light: '#f9fafb', dark: '#111827' },
    },
  },
  spacing: { sm: '8px', md: '16px' },
  fonts: {
    family: { sans: 'Inter, sans-serif' },
    size: { sm: '14px', md: '16px' },
    weight: { '400': '400', '600': '600' },
    lineHeight: { '150': '1.5' },
  },
  shadow: { md: '0 2px 8px rgba(0,0,0,.12)' },
  icon: { sm: '16px' },
  display: { flex: 'flex', block: 'block' },
  breakpoints: {
    mobile: { max: '767px' },
    desktop: { min: '1024px' },
  },
});
```

### 2. Create typed context (React)

```ts
// src/theme/index.ts
import { createTheme } from '@ohJohny/theme-builder/core';
import { createThemeContext } from '@ohJohny/theme-builder/react';
import { themeConfig } from './theme.config';

const created = createTheme(themeConfig, {
  mode: import.meta.env.PROD ? 'hashed' : 'identity',
  inject: import.meta.env.DEV,
  defaultScheme: 'light',
});

export const { ThemeProvider, useTheme, useUtilityClasses, useColorScheme } =
  createThemeContext(created);
```

### 3. Generate CSS for production

```ts
// scripts/build-theme.ts
import { generateThemeArtifacts } from '@ohJohny/theme-builder/core/build-utils';
import { themeConfig } from '../src/theme/theme.config';

const outDir = process.env.THEME_OUT_DIR ?? process.argv[2];
if (!outDir) throw new Error('pass outDir via argv or THEME_OUT_DIR');

await generateThemeArtifacts(themeConfig, {
  mode: 'hashed',
  outDir,
  defaultScheme: 'light',
});
```

```json
"scripts": {
  "build:theme": "bun scripts/build-theme.ts src/generated",
  "prebuild": "bun run build:theme"
}
```

Outputs: `theme.css`, `utility-class-map.json`, `_breakpoints.scss` (when breakpoints are set). `outDir` is **required** — the tool has no default.

### 4. Use in components

```tsx
function Card() {
  const { className, style } = useUtilityClasses({ px: 'md', bg: 'surface-main' });
  return <div className={className} style={style} />;
}
```

Token names autocomplete from your config. Arbitrary values (`px="13px"`) fall back to inline CSS.

## Named color schemes

Declare `schemes: ['light', 'dark', 'sepia']` and use per-scheme color objects. Generated CSS emits `[data-theme="<name>"]` blocks. `changeColorScheme()` with no argument cycles round-robin through all schemes.

## Playground

```bash
bun run dev:playground
```

See `examples/playground` for a full demo with 3 schemes and runtime CSS injection.

