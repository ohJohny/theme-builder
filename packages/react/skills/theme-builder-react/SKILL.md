---
name: ohjohny-theme-builder-react
description: >-
  React ThemeProvider, useTheme, useColorScheme, useDeviceSize, DeviceMatch, and useUtilityClasses
  from @ohJohny/theme-builder/react. Use for utility-class props, className/style from theme tokens,
  resolveBoxPresentation, prepareHostPresentation, classes?.root, and ThemeSlotClasses when building
  or consuming a layout component library. Lib internals use presentation resolvers, not useUtilityClasses.
---

# @ohJohny/theme-builder/react

Re-exports core APIs (`createTheme`, `resolveUtilityClasses`, color-scheme helpers, etc.) — import from one entry when convenient.

## When to use

| Context | Approach |
| ------- | -------- |
| Consumer custom markup (plain element) | `useUtilityClasses({ px: 'md', … })` |
| Consumer with layout hosts (`Box`, `Flex`, `Text`, …) | Layout props on those hosts |
| **Design system lib internals** | `resolveBoxPresentation` or `prepareHostPresentation` + `useTheme()` |
| One-off typography class in lib code | `resolveBoxPresentation(theme, { fontSize: 'sm' }).class` |

**Negative rule:** do **not** call `useUtilityClasses` inside `src/lib-react/**`. The design system owns presentation merging there.

Load this skill when editing `className`, `classes?.root`, `useTheme()` for presentation, or theme utility class output.

## Typed app context (recommended)

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

```tsx
<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

`ThemeProvider` requires `theme: CreatedTheme` from `createTheme`. It wraps children with `DeviceSizeProvider`, so `useDeviceSize()` works anywhere under the tree. Optional `breakpointsRem` forwards to the inner provider.

Also exports: `useDeviceSize`, `DeviceMatch`, `useColorSchemeTogglePosition`, `resolveUtilityClasses`.

Default breakpoints: `DEFAULT_DEVICE_BREAKPOINTS_REM` — 48 / 62 / 80 rem.

## Hooks

- `useTheme()` — typed token tree from context
- `useColorScheme()` — `colorScheme`, `changeColorScheme`, `colorSchemeList`, `labelShort`
- `useDeviceSize(options?)` — `{ mobile, tablet, desktop, wide }`; `options.breakpointsRem` overrides provider defaults
- `DeviceMatch` — renders `children` only when viewport matches `size`
- `useUtilityClasses(props)` — `{ className, style }`; equivalent to `resolveUtilityClasses(props, useTheme())`
- `useColorSchemeTogglePosition(ref)` — view-transition origin CSS vars

## Utility props (consumer custom markup)

```tsx
function PaddedSection({ children }: { children: React.ReactNode }) {
  const { className, style } = useUtilityClasses({
    px: 'md',
    py: 'sm',
    color: 'text-primary',
    fontSize: 'lg',
  });
  return (
    <section className={className} style={style}>
      {children}
    </section>
  );
}
```

Prefer layout hosts from your component library when available:

```tsx
import { Box } from '@your-ui/layout';

function PaddedSection({ children }: { children: React.ReactNode }) {
  return (
    <Box px="md" py="sm" textColor="text-primary" fontSize="lg">
      {children}
    </Box>
  );
}
```

## Layout component integration

A layout/component library built on theme-builder typically extends utility resolution with `resolveBoxPresentation` and `prepareHostPresentation` (not exported from theme-builder). Use those in design-system internals; use `useUtilityClasses` only in consumer app markup without a layout host.

### Class merge order

1. Theme utility classes from layout props (resolver output)
2. `*.module.scss` root / slot class
3. `classes?.root` (or other `ThemeSlotClasses` key)
4. Top-level `className`

### Layout host (`Box`, `Flex`, `Grid`)

```tsx
import { useTheme } from '@ohJohny/theme-builder/react';
import {
  resolveBoxPresentation,
  splitBoxLayoutProps,
  type BoxLayoutStyleProps,
} from '@your-ui/layout';

const theme = useTheme();
const { layout, passThroughProps } = splitBoxLayoutProps(rest);
const presentation = resolveBoxPresentation(theme, layout as BoxLayoutStyleProps, {
  class: [className, classes?.root].filter(Boolean).join(' '),
  style,
});
```

### Themed interactive host (`Button`, `Loader`, …)

```tsx
import { useMemo } from 'react';
import { useTheme } from '@ohJohny/theme-builder/react';
import { prepareHostPresentation } from '@your-ui/layout/presentation';
import { cx } from '@your-ui/utils';

const hostPresentation = useMemo(
  () =>
    prepareHostPresentation(theme, layoutProps, {
      componentId: 'loader',
      extras: { class: cx(styles.root, classes?.root) },
    }),
  [theme, layoutProps, classes?.root],
);
```

### Partial typography class only

```tsx
const labelClass = resolveBoxPresentation(theme, { fontSize: 'sm', fontWeight: 500 }).class;
```

See your layout library's docs for `prepareHostPresentation` API and host patterns.

## Device size

```tsx
function Layout() {
  const { mobile, desktop } = useDeviceSize();
  return mobile ? <MobileNav /> : desktop ? <DesktopNav /> : <TabletNav />;
}
```

## DeviceMatch

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

## CSS

Import or inject theme CSS (`createTheme` with `inject: true`, or `generateThemeArtifacts` at build time). Style `[data-theme="dark"]` on `:root`. This package does not ship app styles.

## TypeScript extension

Augment `@ohJohny/theme-builder/core` interfaces `ThemeColorOverrides` / semantic token overrides in a `.d.ts` file (see `theme-builder-core` skill).

## Peer

`react` >= 18. No icon library coupling.
