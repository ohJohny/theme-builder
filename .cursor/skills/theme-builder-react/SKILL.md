# @ohJohny/theme-builder/react

## Typed app context

```tsx
import { createTheme } from '@ohJohny/theme-builder/core';
import { createThemeContext } from '@ohJohny/theme-builder/react';
import { themeConfig } from './theme/theme.config';

const created = createTheme(themeConfig, {
  mode: import.meta.env.PROD ? 'hashed' : 'identity',
  inject: import.meta.env.DEV,
  defaultScheme: 'light',
});

export const { ThemeProvider, useTheme, useUtilityClasses, useColorScheme } =
  createThemeContext(created);
```

## ThemeProvider

Requires `theme: CreatedTheme` from `createTheme`. Passes `theme.schemes` into the color-scheme store automatically.

```tsx
<ThemeProvider presetColorScheme="light">
  <App />
</ThemeProvider>
```

Also exports: `useDeviceSize`, `DeviceMatch`, `useColorSchemeTogglePosition`.
