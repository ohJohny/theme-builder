# @ohJohny/theme-builder/core

`@ohJohny/theme-builder` is a shorthand alias for `/core`.

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

Helpers: `buildThemeStylesheet`, `buildBreakpointsScss`, `rewriteUtilityCss`, `collectClassNames`.

## Color schemes

- Scheme-varying colors use `{ light, dark, ... }` objects in config.
- CSS emits `:root` (invariant + default scheme) and `[data-theme="<name>"]` blocks.
- `createColorSchemeStore({ schemes })` cycles round-robin when `changeColorScheme()` is called with no argument.
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

Spacing tokens drive padding (`p-*`), margin (`m-*`), and flex/grid gap (`gap-*`) utilities from a single `spacing` config scale.

A consumer layout library typically extends this with `resolveBoxPresentation` and `prepareHostPresentation` in its lib internals (not exported from theme-builder). See the `theme-builder-react` skill — **Layout component integration** — for when to use resolvers vs `useUtilityClasses`.
