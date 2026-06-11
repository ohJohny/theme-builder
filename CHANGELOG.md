# Changelog

## Unreleased

### Added

- Anti-FOUC: `buildColorSchemeInitScript`, `resolveColorSchemeFromCookie`, `theme-init.js` artifact
- System color scheme (`system` preference + `resolvedColorScheme` in store and `useColorScheme()`)
- Semantic color scheme coverage validation in `defineThemeConfig`
- Opt-in `viewTransition` on color-scheme store and providers
- Token scales: `radius`, `motion` (duration/easing), `opacity`, `zIndex`
- Responsive spacing props via `deviceMatches` option on `resolveUtilityClasses`
- CLI: `--watch`, `--storage-key`, `--storage-type`, `--export-dtcg`, `--no-lint-a11y`, `--strict-a11y` (contrast lint on by default)
- `themeBuilder` Vite plugin with `lintA11y` / `strictA11y` options (`@ohJohny/theme-builder/core/build-utils`)
- W3C DTCG export via `exportDesignTokens`
- Contrast lint via `lintThemeContrast`

### Changed

- **Breaking:** `readStoredColorScheme(config, schemes, includeSystemScheme?)` now requires a `schemes` allowlist
- `createColorSchemeStore` listens for `storage` events whenever `storage` is configured (cross-tab sync)

### Deprecated

- `isColorSchemeId` — use `isColorSchemePreference` or `isKnownScheme`
