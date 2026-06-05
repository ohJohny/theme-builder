---
name: ohjohny-theme-builder-react
description: React ThemeProvider, useTheme, useColorScheme, useDeviceSize, DeviceMatch from @ohJohny/theme-builder/react. Use for design tokens, light/dark mode, and responsive device buckets in React apps.
---

# @ohJohny/theme-builder/react

## Setup

```tsx
import { ThemeBuilder, RawThemeBuilder } from '@ohJohny/theme-builder/core';
import {
  ThemeProvider,
  useTheme,
  useColorScheme,
  useDeviceSize,
  DeviceMatch,
  useUtilityClasses,
  DeviceSizeProvider,
  DEFAULT_DEVICE_BREAKPOINTS_REM,
} from '@ohJohny/theme-builder/react';

RawThemeBuilder.getInstance().apply(yourThemeConfig);

ThemeBuilder.getInstance().extend({ colors: { brand: 'var(--color-brand)' } });

<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

`ThemeProvider` always wraps children with `DeviceSizeProvider`, so `useDeviceSize()` works anywhere under `ThemeProvider` without extra wiring. Optional `breakpointsRem` on `ThemeProvider` is forwarded to the inner provider. For a subtree override, nest another `DeviceSizeProvider`.

Default breakpoints match component-0 (48 / 62 / 80 rem → 768 / 992 / 1280 px at 16px root): `DEFAULT_DEVICE_BREAKPOINTS_REM`.

## Hooks

- `useTheme()` — proxy-guarded token tree (updates after `extend()`)
- `useColorScheme()` — `colorScheme`, `changeColorScheme`, `colorSchemeList`
- `useDeviceSize()` — `{ mobile, tablet, desktop, wide }` mutually exclusive booleans from viewport width
- `DeviceMatch` — renders `children` only when viewport matches `size` prop
- `useUtilityClasses({ px: 'md', bg: 'surface-main' })` — `{ className, style }`
- `useColorSchemeTogglePosition(ref)` — view-transition origin CSS vars

## Device size example

```tsx
function Layout() {
  const { mobile, desktop } = useDeviceSize();
  return mobile ? <MobileNav /> : desktop ? <DesktopNav /> : <TabletNav />;
}
```

## DeviceMatch example

```tsx
function Sidebar() {
  return (
    <>
      <DeviceMatch size="mobile">
        <MobileNav />
      </DeviceMatch>
      <DeviceMatch size="desktop">
        <DesktopNav />
      </DeviceMatch>
    </>
  );
}
```

## Utility props example

```tsx
function Box() {
  const { className, style } = useUtilityClasses({
    px: 'md',
    py: 'sm',
    color: 'text-primary',
    fontSize: 'lg',
  });
  return <div className={className} style={style} />;
}
```

## CSS

Import or inject theme CSS (`RawThemeBuilder.apply`). Style `[data-theme="dark"]` on `:root`. This package does not ship styles.

## TypeScript extension

Augment `@ohJohny/theme-builder/core` interfaces `ThemeColorOverrides` / `SemanticColorTokenOverrides` in a `.d.ts` file.

## Peer

`react` >= 18. No icon library coupling.
