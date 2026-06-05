---
name: ohjohny-theme-builder-solid
description: Solid ThemeProvider, useTheme, useColorScheme, useDeviceSize, DeviceMatch from @ohJohny/theme-builder/solid. Use for design tokens, light/dark mode, and responsive device buckets in Solid apps.
---

# @ohJohny/theme-builder/solid

## Setup

```tsx
/** @jsxImportSource solid-js */
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
} from '@ohJohny/theme-builder/solid';

RawThemeBuilder.getInstance().apply(yourThemeConfig);

ThemeBuilder.getInstance().extend({ colors: { brand: 'var(--color-brand)' } });

<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

`ThemeProvider` always wraps children with `DeviceSizeProvider`, so `useDeviceSize()` works anywhere under `ThemeProvider` without extra wiring. Optional `breakpointsRem` on `ThemeProvider` is forwarded to the inner provider. For a subtree override, nest another `DeviceSizeProvider`.

Default breakpoints match component-0 (48 / 62 / 80 rem → 768 / 992 / 1280 px at 16px root): `DEFAULT_DEVICE_BREAKPOINTS_REM`.

## Hooks

- `useTheme()` — token tree from singleton (reactive after `extend()`)
- `useColorScheme()` — accessors: `colorScheme()`, `changeColorScheme`, `colorSchemeList()`
- `useDeviceSize()` — accessor `() => { mobile, tablet, desktop, wide }` mutually exclusive booleans from viewport width
- `DeviceMatch` — renders `children` only when viewport matches `size` prop
- `useUtilityClasses(() => ({ px: 'md' }))` — accessor `() => { className, style }`
- `useColorSchemeTogglePosition(buttonRef)` — view-transition CSS vars

## Device size example

```tsx
function Layout() {
  const matches = useDeviceSize();
  return matches().mobile ? <MobileNav /> : matches().desktop ? <DesktopNav /> : <TabletNav />;
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
  const utility = useUtilityClasses({ px: 'md', bg: 'surface-main' });
  return <div class={utility().className} style={utility().style} />;
}
```

## CSS

Inject theme CSS via `RawThemeBuilder.apply`. No styles ship with this package.

## TypeScript extension

Augment `@ohJohny/theme-builder/core` in a consumer `.d.ts` file.

## Peer

`solid-js` >= 1.8.
