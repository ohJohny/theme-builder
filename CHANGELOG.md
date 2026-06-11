# Changelog

## Unreleased

### Added

- Anti-FOUC: `buildColorSchemeInitScript`, `resolveColorSchemeFromCookie`, `theme-init.js` artifact
- System color scheme (`system` preference + `resolvedColorScheme` in store and `useColorScheme()`)
- Semantic color scheme coverage validation in `defineThemeConfig`
- Opt-in `viewTransition` on color-scheme store and providers
- Token scales: `radius`, `motion` (duration/easing), `opacity`, `zIndex`
- Responsive spacing props via `deviceMatches` option on `resolveUtilityClasses`
- `resolveDeviceMatchesFromBreakpoints` — evaluates `config.breakpoints` against viewport width
- `ColorSchemeProfile` type for shared init-script / store / SSR settings
- `createColorSchemeStore().mount()` — explicit client lifecycle (call from providers)
- CLI: `--watch`, `--storage-key`, `--storage-type`, `--export-dtcg`, `--no-lint-a11y`, `--strict-a11y` (contrast lint on by default)
- `themeBuilder` Vite plugin with `lintA11y` / `strictA11y` options (`@ohJohny/theme-builder/core/build-utils`)
- W3C DTCG export via `exportDesignTokens`
- Contrast lint via `lintThemeContrast`
- Dev warnings when `SingletonThemeProvider` options mismatch the first island

### Changed

- **Breaking:** `readStoredColorScheme(config, schemes, includeSystemScheme?)` now requires a `schemes` allowlist
- **Breaking:** `createColorSchemeStore` no longer auto-mounts — providers call `mount()` in an effect
- `createColorSchemeStore` listens for `storage` events only for `localStorage` (not cookies)
- Store persistence uses configured `storage.type` only (`writePersistedColorScheme` remains for Storybook dual-write)
- CLI default config path: `src/theme/theme.config.ts` (legacy `src/theme/default-theme.ts` fallback with deprecation warning)
- `createTheme({ inject: true, mode: 'hashed' })` rewrites utility classes to match `classMap`
- `generateThemeArtifacts` and `createTheme` share `buildThemeCss`
- Vite plugin calls `generateThemeArtifacts` directly (no `process.argv` leakage)
- `useUtilityClasses` / `useDeviceSize` use `config.breakpoints` when present under `ThemeProvider`
- `tsx` is an optional peer dependency (install `-D tsx` for `.ts` config modules)
- Published `sideEffects` lists runtime entry points for correct bundler behavior

### Deprecated

- `isColorSchemeId` — use `isColorSchemePreference` or `isKnownScheme`
- `src/theme/default-theme.ts` CLI default path — use `src/theme/theme.config.ts`
