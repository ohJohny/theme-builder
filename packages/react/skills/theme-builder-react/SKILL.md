---
name: ohjohny-theme-builder-react
description: >-
  React ThemeProvider, SingletonThemeProvider, useTheme, useColorScheme, useDeviceSize, DeviceMatch,
  and useUtilityClasses from @ohJohny/theme-builder/react. Use SingletonThemeProvider for Astro islands
  or other multi-root setups. Use for utility-class props, className/style from theme tokens,
  resolveBoxPresentation, prepareHostPresentation, classes?.root, and ThemeSlotClasses when building
  or consuming a layout component library. Lib internals use presentation resolvers, not useUtilityClasses.
---

# @ohJohny/theme-builder/react

Re-exports core APIs (`createTheme`, `resolveUtilityClasses`, color-scheme helpers, etc.) — import from one entry when convenient.

## When to use

| Context | Approach |
| ------- | -------- |
| Single React root (SPA) | `ThemeProvider` |
| Multiple roots (Astro islands, micro-frontends) | `SingletonThemeProvider` per root — shared color-scheme store |
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

export const { ThemeProvider, SingletonThemeProvider, useTheme, useUtilityClasses, useColorScheme } =
  createThemeContext(created);
```

```tsx
<ThemeProvider presetColorScheme="light" storage={{ type: 'localStorage', key: 'theme' }}>
  <App />
</ThemeProvider>
```

`ThemeProvider` requires `theme: CreatedTheme` from `createTheme`. It wraps children with `DeviceSizeProvider`, so `useDeviceSize()` works anywhere under the tree. Optional `breakpointsRem` forwards to the inner provider.

Also exports: `SingletonThemeProvider`, `useDeviceSize`, `DeviceMatch`, `useColorSchemeTogglePosition`, `resolveUtilityClasses`, `useColorSchemeContext`, `peekOrCreateSharedColorSchemeStore`, `retainSharedColorSchemeStore`, `releaseSharedColorSchemeStore`.

Default breakpoints: `DEFAULT_DEVICE_BREAKPOINTS_REM` — 48 / 62 / 80 rem.

## How it works

`createThemeContext(created)` returns bound exports from one `CreatedTheme`:

| Export | Role |
| ------ | ---- |
| `ThemeProvider` | Same as the base provider but omits the `theme` prop (uses `created` from closure) |
| `SingletonThemeProvider` | Multi-root wrapper — shared ref-counted color-scheme store; same props as `ThemeProvider` minus `theme` |
| `useTheme` | Typed token tree for your config |
| `useUtilityClasses` | Resolves utility props against `created.theme` |
| `useColorScheme` | Subscribes to the color-scheme store |
| `theme` | The `CreatedTheme` instance (build scripts, tests, non-React code) |

`ThemeProvider` sets up three contexts:

1. **ThemeContext** — static token tree (`created.theme`); stable when the color scheme changes
2. **ColorSchemeContext** — `createColorSchemeStore` API (`subscribe`, `getState`, `changeColorScheme`); does **not** re-render the provider subtree on scheme changes
3. **DeviceSizeContext** — breakpoint defaults for `useDeviceSize`

`useColorScheme()` is the only hook that subscribes to scheme changes (`useSyncExternalStore` on the store). Components that only call `useTheme()` or `useUtilityClasses()` stay stable across toggles.

### SingletonThemeProvider (Astro islands / multi-root)

React context does **not** cross separate roots. Each island still needs its own provider so hooks work, but `ThemeProvider` creates a **new** color-scheme store per mount — islands won't sync and will fight over `data-theme`.

Use `SingletonThemeProvider` instead: one module-level store (ref-counted), same contexts per root.

```tsx
export const { SingletonThemeProvider, useColorScheme } = createThemeContext(created);
```

```astro
---
import { SingletonThemeProvider } from '../theme/context';
import { ThemeToggle } from './ThemeToggle';
---
<SingletonThemeProvider client:load storage={{ type: 'localStorage', key: 'theme' }}>
  <ThemeToggle />
</SingletonThemeProvider>
```

Rules:

- Wrap **each** interactive island; children must be inside the same island as the provider.
- Pass the **same** store options on every island (`storage`, `presetColorScheme`, …). **First mount wins** — later mismatched options are ignored.
- Import/inject theme CSS once in the layout (`generateThemeArtifacts` or `createTheme` with `inject: true` in dev).
- No separate singleton for `DeviceSizeProvider` — `useDeviceSize` already shares a ref-counted `resize` listener.

Low-level (rare): `peekOrCreateSharedColorSchemeStore`, `retainSharedColorSchemeStore`, `releaseSharedColorSchemeStore` from `@ohJohny/theme-builder/core` — used internally by `SingletonThemeProvider`.

### Without `createThemeContext`

Use the base exports when you prefer passing `theme` explicitly:

```tsx
import {
  ThemeProvider,
  useTheme,
  useUtilityClasses,
  useColorScheme,
} from '@ohJohny/theme-builder/react';

<ThemeProvider theme={created} presetColorScheme="light">
  <App />
</ThemeProvider>
```

Hooks default to `ThemeConfigInput` unless you augment types or use `createThemeContext` for inference from your config.

### Advanced: `useColorSchemeContext`

Direct store access for custom subscriptions or imperative reads:

```tsx
import { useColorSchemeContext } from '@ohJohny/theme-builder/react';

const store = useColorSchemeContext();
store.changeColorScheme('dark');
const { colorScheme } = store.getState();
```

Prefer `useColorScheme()` in UI — it handles subscription and returns `{ colorScheme, changeColorScheme, colorSchemeList, labelShort }`.

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
