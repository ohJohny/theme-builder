# @ohJohny/theme-builder/solid

Mirror of the React surface — same config-first flow.

```tsx
import { createTheme } from '@ohJohny/theme-builder/core';
import { createThemeContext } from '@ohJohny/theme-builder/solid';
import { themeConfig } from './theme/theme.config';

const created = createTheme(themeConfig, { mode: 'identity', inject: true });
export const { ThemeProvider, useTheme, useUtilityClasses, useColorScheme } =
  createThemeContext(created);
```

`ThemeProvider` requires `theme: CreatedTheme`. `useTheme()` reads from context accessor.

Also exports: `useDeviceSize`, `DeviceMatch`, `useColorSchemeTogglePosition`.
