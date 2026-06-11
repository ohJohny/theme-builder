# Astro islands example

This example documents a multi-root setup with shared color-scheme state.

## Layout (`src/layouts/Base.astro`)

```astro
---
import '../generated/theme.css';
import { buildColorSchemeInitScript } from '@ohJohny/theme-builder/core';

const themeInit = buildColorSchemeInitScript({
  schemes: ['light', 'dark'],
  defaultScheme: 'light',
  storage: { type: 'localStorage', key: 'theme' },
});
---
<html lang="en">
  <head>
    <script set:html={themeInit} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Generate `theme.css` with `generateThemeArtifacts` (see root README **Preventing flash of wrong theme**). Inline the init script in the layout (as above) or serve `theme-init.js` externally — match `storage` with every `SingletonThemeProvider`.

## Island A — theme toggle

```astro
---
import { SingletonThemeProvider } from '../theme/context';
import ThemeToggle from './ThemeToggle';
---
<SingletonThemeProvider client:load storage={{ type: 'localStorage', key: 'theme' }} viewTransition>
  <ThemeToggle />
</SingletonThemeProvider>
```

## Island B — panel that reads scheme

```astro
---
import { SingletonThemeProvider } from '../theme/context';
import StatusPanel from './StatusPanel';
---
<SingletonThemeProvider client:load storage={{ type: 'localStorage', key: 'theme' }}>
  <StatusPanel />
</SingletonThemeProvider>
```

Pass identical store options on every island (`storage`, `presetColorScheme`, `viewTransition`). First mount wins.

Toggling in island A updates `useColorScheme()` in island B because both share the ref-counted store from `SingletonThemeProvider`.
