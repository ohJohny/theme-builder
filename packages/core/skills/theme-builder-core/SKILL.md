# @ohJohny/theme-builder/core

`@ohJohny/theme-builder` is a shorthand alias for `/core`.

## Import guide

| Entry | Use for |
|-------|---------|
| `@ohJohny/theme-builder/core` | Runtime — `createTheme`, store, `resolveColorSchemeFromCookie`, inline init script |
| `@ohJohny/theme-builder/core/build-utils` | Build — `generateThemeArtifacts`, `themeBuilder`, `lintThemeContrast`, hashing |

`utility-class-map.json` is for debugging/tooling; runtime uses `createTheme().classMap`. Optional peer: `tsx` when loading `.ts` config files.

## Config-first setup

```ts
import { defineThemeConfig, createTheme } from '@ohJohny/theme-builder/core';

export const themeConfig = defineThemeConfig({
  schemes: ['light', 'dark', 'sepia'] as const,
  colors: {
    base: { white: '#fff', black: '#000' },
    semantic: {
      'text-primary': { light: '#111', dark: '#eee', sepia: '#333' },
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
    tablet: { min: '768px', max: '1023px' },
    desktop: { min: '1024px' },
  },
});

const created = createTheme(themeConfig, {
  mode: 'identity',       // or 'hashed' in production
  inject: true,           // dev: inject CSS at runtime
  defaultScheme: 'light',
});

// created.theme — typed token tree
// created.schemes — for ThemeProvider / color-scheme store
```

Never annotate the config variable with `ThemeConfigInput` — use `defineThemeConfig({...})` so literal keys are inferred for autocomplete.

## Build-time artifacts

```ts
import { generateThemeArtifacts } from '@ohJohny/theme-builder/core/build-utils';

await generateThemeArtifacts(themeConfig, {
  mode: 'hashed',
  outDir: 'src/generated',   // required — no default
  defaultScheme: 'light',
});
// writes: theme.css, utility-class-map.json, _breakpoints.scss (when breakpoints set)
```

Optional outputs and checks (see **Tooling** below): `initScript`, `exportDtcg`, `lintA11y`, `strictA11y`.

Lower-level helpers: `buildThemeStylesheet`, `buildBreakpointsScss`, `rewriteUtilityCss`, `collectClassNames`, `buildColorSchemeInitScript`, `resolveColorSchemeFromCookie`.

## Tooling

CLI, Vite plugin, DTCG export, and contrast lint live in `@ohJohny/theme-builder/core/build-utils` (or the `theme-builder` CLI binary).

### CLI

```bash
# Watch config and regenerate artifacts on change
theme-builder generate --watch --config src/theme/theme.config.ts --out src/generated

# Anti-FOUC init script + DTCG export + contrast lint
theme-builder generate \
  --config src/theme/theme.config.ts \
  --out src/generated \
  --storage-key theme \
  --storage-type localStorage \
  --export-dtcg

# Fail the build on contrast violations (lint is on by default)
theme-builder generate --strict-a11y

# Opt out of contrast warnings
theme-builder generate --no-lint-a11y
```

| Flag | Effect |
| ---- | ------ |
| `--watch` | Re-run generation when the config file changes |
| `--config`, `--out`, `--mode`, `--default-scheme` | Paths and build options (`THEME_*` env vars also supported) |
| `--storage-key`, `--storage-type` | Emit `theme-init.js` + `theme-init.html` (`localStorage` or `cookie`) |
| `--export-dtcg` | Write `design-tokens.json` (W3C DTCG) |
| `--no-lint-a11y` | Skip contrast warnings (enabled by default) |
| `--strict-a11y` | Throw instead of warn on contrast failures |

Config modules may also export `themeInitOptions` for init-script defaults.

### Vite plugin

Regenerates theme artifacts on `buildStart` and when the config file changes during dev:

```ts
import { defineConfig } from 'vite';
import { themeBuilder } from '@ohJohny/theme-builder/core/build-utils';

export default defineConfig({
  plugins: [
    themeBuilder({
      configPath: 'src/theme/theme.config.ts',
      outDir: 'src/generated',
      storageKey: 'theme',
      storageType: 'localStorage',
      lintA11y: true, // default
      strictA11y: process.env.CI === 'true',
    }),
  ],
});
```

### Programmatic APIs

```ts
import {
  exportDesignTokens,
  lintThemeContrast,
  generateThemeArtifacts,
} from '@ohJohny/theme-builder/core/build-utils';

const dtcg = exportDesignTokens(themeConfig); // W3C DTCG JSON

const warnings = lintThemeContrast(themeConfig);
// { token, scheme, foreground, background, ratio }[]

await generateThemeArtifacts(themeConfig, {
  mode: 'hashed',
  outDir: 'src/generated',
  defaultScheme: 'light',
  initScript: { storage: { type: 'localStorage', key: 'theme' } },
  exportDtcg: true,
  // lintA11y defaults to true; strictA11y defaults to false
  strictA11y: process.env.CI === 'true',
});
```

`exportDesignTokens` covers colors, spacing, fonts, radius, and motion. `lintThemeContrast` checks semantic foreground/background pairs per scheme (hex colors; minimum ratio 4.5).

## Anti-FOUC

Set `data-theme` before first paint. `ThemeProvider` runs too late on its own.

**Match storage everywhere** — init script, provider, and SSR must share the same `storage.key`, `storage.type`, `schemes`, and default/preset.

**Client (pick one):**
- External: `<script src="/theme-init.js"></script>` in `<head>` before CSS (`theme-init.html` is a copy-paste snippet).
- Inline (often faster): `<script>${buildColorSchemeInitScript({...})}</script>` in a shared layout — no extra request.

Generate via `generateThemeArtifacts` `initScript`, CLI `--storage-key` / `--storage-type`, or `buildColorSchemeInitScript` directly. Preload/`fetchpriority` is usually unnecessary when the script is first in `<head>`; inlining skips the network hop.

**SSR:** `resolveColorSchemeFromCookie` → `<html data-theme={scheme}>`. Use `cookie` storage (not `localStorage`) when pairing init script + provider with SSR.

`createColorSchemeStore().mount()` is client-only (`typeof window` guard). On the server the store stays unmounted — `getState()` uses `schemes[0]` until the provider mounts on the client.

**SSR + hooks:** UI that displays `colorScheme` from `useColorScheme()` may render `schemes[0]` in SSR HTML, then update after client `mount()` reads storage. That does not break styling if `[data-theme]` is set correctly on `<html>` via cookie or init script. Prefer `data-theme` for theme CSS; treat hook-driven labels (toggle text, scheme name) as client-only or accept one post-hydration update.

Store re-applies the stored preference on client `mount()` via `resolveColorSchemePreference` — no visual flash when init script or SSR `data-theme` is correct.

## Color schemes

- Scheme-varying colors use `{ light, dark, ... }` objects in config.
- CSS emits `:root` (invariant + default scheme) and `[data-theme="<name>"]` blocks.
- `createColorSchemeStore({ schemes })` — call `mount()` on the client (providers do this); `dispose()` on unmount. Cycles round-robin when `changeColorScheme()` is called with no argument (includes `system` when `includeSystemScheme` is true).
- `SYSTEM_COLOR_SCHEME` (`'system'`) follows OS preference; `getState().resolvedColorScheme` is what lands on `data-theme`.
- Optional `viewTransition: true` wraps scheme changes in `startColorSchemeViewTransition`.
- Multi-root apps (Astro islands): use `SingletonThemeProvider` from `@ohJohny/theme-builder/react` or `/solid` — it wraps a shared store via `peekOrCreateSharedColorSchemeStore`, `retainSharedColorSchemeStore`, and `releaseSharedColorSchemeStore` (ref-counted dispose when the last provider unmounts). One store per page; first-call options win.

## Utility props

`resolveUtilityClasses(props, created.theme)` maps known tokens to classes; arbitrary values fall back to inline CSS.

```ts
import { resolveUtilityClasses } from '@ohJohny/theme-builder/core';

const { className, style } = resolveUtilityClasses(
  { px: 'md', color: 'text-primary', bg: '#fff' },
  created.theme,
);
// px/md → utility class; raw bg → inline style
```

Spacing tokens drive padding (`p-*`), margin (`m-*`), and flex/grid gap (`gap-*`) utilities from a single `spacing` config scale. Also: `radius`, `motion.duration` → `transition`, `opacity`, `zIndex`. Responsive spacing: `{ px: { mobile: 'sm', desktop: 'md' } }` with `resolveUtilityClasses(props, theme, { deviceMatches })`.

A consumer layout library typically extends this with `resolveBoxPresentation` and `prepareHostPresentation` in its lib internals (not exported from theme-builder). See the `theme-builder-react` skill — **Layout component integration** — for when to use resolvers vs `useUtilityClasses`.
