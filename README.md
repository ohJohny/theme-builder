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

`createThemeContext` binds your `CreatedTheme` to typed hooks — you omit `theme` on `ThemeProvider` and get config-aware autocomplete on `useTheme` / `useUtilityClasses`. The provider exposes a static token tree and a color-scheme store; only components calling `useColorScheme()` re-render when the scheme changes.

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

Outputs: `theme.css`, `utility-class-map.json`, `_breakpoints.scss` (when breakpoints are set), and optionally `theme-init.js` + `theme-init.html` (when `initScript` is set). `outDir` is **required** — the tool has no default.

Pass `initScript` to emit a blocking anti-FOUC script, or use CLI flags `--storage-key` / `--storage-type`, or export `themeInitOptions` from your config module:

```ts
await generateThemeArtifacts(themeConfig, {
  mode: 'hashed',
  outDir,
  defaultScheme: 'light',
  initScript: { storage: { type: 'localStorage', key: 'theme' } },
});
```

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

## Preventing flash of wrong theme

`ThemeProvider` applies the color scheme after JS loads. To avoid a flash when the user previously chose a non-default scheme, set `data-theme` **before first paint**.

**Match storage everywhere.** The init script, `ThemeProvider` / `SingletonThemeProvider`, and (if used) SSR must use the same `storage.key`, `storage.type`, `schemes`, and `defaultScheme` / `presetColorScheme`. A mismatch means the script reads one key while the store writes another.

When `initScript` is set, generation also writes `theme-init.html` — a copy-paste snippet with the external `<script src>` form.

### 1. Blocking init script (client)

Place the script in `<head>` **before** your stylesheet. The script is a tiny blocking IIFE that reads storage and sets `document.documentElement.setAttribute("data-theme", scheme)`.

**External file** (default artifact):

```html
<head>
  <script src="/theme-init.js"></script>
  <link rel="stylesheet" href="/theme.css" />
</head>
```

Generate via `generateThemeArtifacts` with `initScript`, or call `buildColorSchemeInitScript` directly. `examples/playground` writes `public/theme-init.js` in a `predev` script the same way.

**Inline** (often faster — no extra request). `buildColorSchemeInitScript()` returns the raw JS; embed it in a shared layout at build time:

```html
<head>
  <script>
    (function(){/* output of buildColorSchemeInitScript() */})();
  </script>
  <link rel="stylesheet" href="/theme.css" />
</head>
```

```ts
import { buildColorSchemeInitScript } from '@ohJohny/theme-builder/core';

const js = buildColorSchemeInitScript({
  schemes: themeConfig.schemes ?? ['light', 'dark'],
  defaultScheme: 'light',
  storage: { type: 'localStorage', key: 'theme' },
});
// layout: `<script>${js}</script>`
```

Prefer inline when you have a layout template (Astro, Next.js, etc.). Prefer external when strict CSP blocks inline scripts and you rely on nonces instead.

**Preload is usually unnecessary.** A blocking `<script src>` at the top of `<head>` is already fetched with high urgency. `<link rel="preload" as="script">` adds little at this size; inlining removes the network hop entirely.

The script uses the same resolution logic as `createColorSchemeStore` (including `system` → `prefers-color-scheme`).

### 2. SSR `data-theme` from cookie

Best when HTML is server-rendered: crawlers and first paint get the correct attribute without client JS.

On the server, read the cookie and set the attribute on `<html>`:

```ts
import { resolveColorSchemeFromCookie } from '@ohJohny/theme-builder/core';

const scheme = resolveColorSchemeFromCookie(request.headers.get('cookie') ?? undefined, {
  schemes: themeConfig.schemes ?? ['light', 'dark'],
  preset: 'light',
  storageKey: 'theme',
});
// <html data-theme={scheme}>
```

Use `storage: { type: 'cookie', key: 'theme' }` for the init script and `ThemeProvider` when pairing with SSR. `localStorage` is invisible to the server.

### 3. ThemeProvider confirms on mount

Keep `ThemeProvider` (with matching `storage` and `presetColorScheme`). The store re-applies the same scheme on mount — no visible flash when the init script or SSR attribute is correct.

## Playground

```bash
bun run dev:playground
```

See `examples/playground` for a full demo with 3 schemes and runtime CSS injection.

## System color scheme

Persist and cycle a `system` preference that follows OS `prefers-color-scheme`:

```tsx
const { colorScheme, resolvedColorScheme, changeColorScheme } = useColorScheme();
// colorScheme may be 'system'; resolvedColorScheme is the applied data-theme value
changeColorScheme('system');
```

Disable with `includeSystemScheme={false}` on `ThemeProvider`.

## View transitions

```tsx
<ThemeProvider theme={created} viewTransition storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

Pair with `useColorSchemeTogglePosition(ref)` and `@view-transition` CSS (see playground).

## Token scales

| Config key | Utility props | CSS vars |
|------------|---------------|----------|
| `radius` | `radius` | `--radius-*`, `.rounded-*` |
| `motion.duration` | `transition` | `--motion-duration-*`, `.duration-*` |
| `opacity` | `opacity` | `--opacity-*`, `.opacity-*` |
| `zIndex` | `zIndex` | `--z-index-*`, `.z-*` |

Motion duration vars zero out under `[data-reduced-motion]` when configured.

## Responsive spacing

Pass breakpoint maps and optional device context:

```ts
resolveUtilityClasses(
  { px: { mobile: 'sm', desktop: 'md' } },
  theme,
  { deviceMatches: { mobile: true, desktop: false } },
);
```

## Tooling

```bash
# Watch config and regenerate artifacts
theme-builder generate --watch --config src/theme/theme.config.ts --out src/generated

# Anti-FOUC init script + DTCG export (contrast lint runs by default)
theme-builder generate --storage-key theme --storage-type localStorage --export-dtcg

# Fail CI on contrast violations
theme-builder generate --strict-a11y

# Opt out of contrast warnings
theme-builder generate --no-lint-a11y
```

Vite plugin (`lintA11y` defaults to `true`; pass `strictA11y: true` in CI):

```ts
import { themeBuilder } from '@ohJohny/theme-builder/core/build-utils';

export default defineConfig({
  plugins: [
    themeBuilder({
      configPath: 'src/theme/theme.config.ts',
      outDir: 'src/generated',
      storageKey: 'theme',
      storageType: 'localStorage',
      strictA11y: process.env.CI === 'true',
    }),
  ],
});
```

## Examples

- `examples/playground` — live token preview
- `examples/astro-islands` — multi-root `SingletonThemeProvider` pattern
- `examples/storybook` — toolbar sync recipe

