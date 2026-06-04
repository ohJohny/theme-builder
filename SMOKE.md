# Smoke verification

```ts
import { ThemeBuilder, createColorSchemeStore } from '@ohJohny/theme-builder-core';

const theme = ThemeBuilder.getInstance().getTheme();
console.assert(typeof theme.spacing.p.md.class === 'string', 'spacing token');

const scheme = createColorSchemeStore({ presetColorScheme: 'light' });
scheme.changeColorScheme('dark');
console.assert(scheme.getState().colorScheme === 'dark', 'color scheme');
scheme.dispose();
```

React / Solid: `<ThemeProvider>` + `useTheme()` / `useColorScheme()`.
