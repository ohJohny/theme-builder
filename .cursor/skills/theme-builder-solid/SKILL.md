---
name: ohjohny-theme-builder-solid
description: >-
  Solid ThemeProvider, useTheme, useColorScheme, useDeviceSize, DeviceMatch, and useUtilityClasses
  from @ohJohny/theme-builder/solid. Use for design tokens, light/dark mode, responsive device
  buckets, and utility-class props in Solid apps.
---

# @ohJohny/theme-builder/solid

Re-exports common core APIs (`ThemeBuilder`, `RawThemeBuilder`, `resolveUtilityClasses`, etc.) — import from one entry when convenient.

## Setup

```tsx
/** @jsxImportSource solid-js */
import {
  ThemeProvider,
  ThemeBuilder,
  RawThemeBuilder,
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

## Hooks (Solid accessors)

- `useTheme()` — current `Theme` snapshot (reactive after `extend()`)
- `useColorScheme()` — `colorScheme()`, `changeColorScheme`, `colorSchemeList()`, `labelShort()`
- `useDeviceSize(options?)` — accessor `() => { mobile, tablet, desktop, wide }`; `options.breakpointsRem` overrides provider defaults
- `DeviceMatch` — renders `children` only when viewport matches `size` prop
- `useUtilityClasses(props)` or `useUtilityClasses(() => props)` — accessor `() => { className, style }`
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
  const utility = useUtilityClasses(() => ({
    px: 'md',
    py: 'sm',
    color: 'text-primary',
    fontSize: 'lg',
  }));
  return <div class={utility().className} style={utility().style} />;
}
```

## CSS

Inject theme CSS via `RawThemeBuilder.apply`. No styles ship with this package.

## TypeScript extension

Augment `@ohJohny/theme-builder/core` in a consumer `.d.ts` file (see core skill).

## Peer

`solid-js` >= 1.8.
