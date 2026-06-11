# Smoke verification

```ts
import { createTheme, createColorSchemeStore, defineThemeConfig } from '@ohJohny/theme-builder/core';

const config = defineThemeConfig({
  schemes: ['light', 'dark'] as const,
  colors: {
    semantic: {
      'text-primary': { light: '#111', dark: '#eee' },
    },
  },
  spacing: { md: '16px' },
});

const created = createTheme(config, { mode: 'identity' });
console.assert(typeof created.theme.spacing.p.md.class === 'string', 'spacing token');

const store = createColorSchemeStore({
  schemes: created.schemes,
  presetColorScheme: 'light',
  applyColorSchemeOnMount: false,
});
store.changeColorScheme('dark');
console.assert(store.getState().colorScheme === 'dark', 'color scheme');
store.dispose();
```

React / Solid: `<ThemeProvider theme={created}>` + `useTheme()` / `useColorScheme()`.

Anti-FOUC: add generated `theme-init.js` in `<head>` before CSS (see README).
