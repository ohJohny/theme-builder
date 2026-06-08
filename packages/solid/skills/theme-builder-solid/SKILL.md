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

Also exports: `SingletonThemeProvider`, `useDeviceSize`, `DeviceMatch`, `useColorSchemeTogglePosition`, `peekOrCreateSharedColorSchemeStore`, `retainSharedColorSchemeStore`, `releaseSharedColorSchemeStore`.

## SingletonThemeProvider (multi-root)

Same as React: use when you have **separate Solid roots** (e.g. Astro islands with `@astrojs/solid-js`). Each root needs its own `SingletonThemeProvider` so hooks resolve context, but all instances share one ref-counted color-scheme store — toggling in one island updates `useColorScheme()` in others.

```tsx
<SingletonThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <Widget />
</SingletonThemeProvider>
```

Pass identical store options on every island; first mount wins. No singleton needed for device size — `useDeviceSize` already uses a shared ref-counted `resize` subscription.
