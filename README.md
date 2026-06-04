# @ohJohny/theme-builder

Framework-agnostic design-token runtime with React and Solid providers.

## Packages

| Package | Description |
|---------|-------------|
| `@ohJohny/theme-builder-core` | `ThemeBuilder`, `RawThemeBuilder`, color-scheme DOM helpers |
| `@ohJohny/theme-builder-react` | `ThemeProvider`, `useTheme`, `useColorScheme` |
| `@ohJohny/theme-builder-solid` | Same surface for Solid |

## Quick start (Solid)

```tsx
import { ThemeProvider } from '@ohJohny/theme-builder-solid';
import { ThemeBuilder } from '@ohJohny/theme-builder-core';

ThemeBuilder.getInstance().extend({ colors: { brand: 'var(--color-brand)' } });

<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

Import matching CSS from your app (not shipped by this package).

## Build

```bash
bun install
bun run build
```
