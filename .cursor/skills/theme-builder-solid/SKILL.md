# @ohJohny/theme-builder/solid

Mirror of the React surface — same config-first flow.

```tsx
import { createTheme } from '@ohJohny/theme-builder/core';
import { createThemeContext } from '@ohJohny/theme-builder/solid';
import { themeConfig } from './theme/theme.config';

const created = createTheme(themeConfig, { mode: 'identity', inject: true });
export const { ThemeProvider, SingletonThemeProvider, useTheme, useUtilityClasses, useColorScheme } =
  createThemeContext(created);
```

`ThemeProvider` requires `theme: CreatedTheme`. `useTheme()` reads from context accessor.

Also exports: `SingletonThemeProvider`, `useDeviceSize`, `useReducedMotion`, `DeviceMatch`, `useColorSchemeTogglePosition`, `peekOrCreateSharedColorSchemeStore`, `retainSharedColorSchemeStore`, `releaseSharedColorSchemeStore`, `subscribeReducedMotion`, `getReducedMotionSnapshot`, `applyReducedMotion`.

## SingletonThemeProvider (multi-root)

Same as React: use when you have **separate Solid roots** (e.g. Astro islands with `@astrojs/solid-js`). Each root needs its own `SingletonThemeProvider` so hooks resolve context, but all instances share one ref-counted color-scheme store — toggling in one island updates `useColorScheme()` in others.

```tsx
<SingletonThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <Widget />
</SingletonThemeProvider>
```

Pass identical store options on every island; first mount wins. No singleton needed for device size — `useDeviceSize` already uses a shared ref-counted `resize` subscription. `ThemeProvider` passes `reducedMotion` via context (`Accessor<boolean>`); optional `reducedMotion` prop overrides the OS preference. Outside a provider, `useReducedMotion()` falls back to a shared ref-counted `matchMedia` listener.

**SSR:** `ThemeProvider` / `SingletonThemeProvider` call `store.mount()` only on the client. SSR HTML from `useColorScheme()` may show `schemes[0]` until mount; use `[data-theme]` on `<html>` for correct first-paint styling (see `theme-builder-core` **Anti-FOUC**). Treat hook-driven scheme labels as client-only or accept one post-mount update.

## Hooks

- `useTheme()` — typed token tree accessor from context
- `useColorScheme()` — `colorScheme`, `resolvedColorScheme`, `changeColorScheme`, `colorSchemeList`, `labelShort` accessors
- `useDeviceSize(options?)` — `Accessor<{ mobile, tablet, desktop, wide }>`
- `useReducedMotion()` — `Accessor<boolean>`; OS `prefers-reduced-motion` preference
- `DeviceMatch` — renders `children` only when viewport matches `size`
- `useUtilityClasses(props)` — `{ className, style }`
- `useColorSchemeTogglePosition(ref)` — view-transition origin CSS vars

## Reduced motion

```tsx
function AnimatedPanel(props: { children: JSX.Element }) {
  const reducedMotion = useReducedMotion();
  return (
    <div class={reducedMotion() ? styles.static : styles.animated}>{props.children}</div>
  );
}
```

Use `[data-reduced-motion]` in CSS when any `useReducedMotion()` subscriber is mounted. Core exports `subscribeReducedMotion` / `getReducedMotionSnapshot` for imperative or custom subscriptions.

## Build tooling

CLI watch mode, `themeBuilder` Vite plugin, DTCG export (`exportDesignTokens`), and contrast lint (`lintThemeContrast`) are documented in the **Tooling** section of the `theme-builder-core` skill.
