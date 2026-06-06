# component-0 migration guide

Apply after `@ohJohny/theme-builder` config-first release is published.

component-0 is not in this repo — copy these templates into your component-0 project and adjust paths.

## Steps

1. Add `src/theme/theme.config.ts` — see [theme.config.ts.template](./theme.config.ts.template)
2. Add `src/theme/index.ts` — see [index.ts.template](./index.ts.template)
3. Add `scripts/build-theme.ts` — see [build-theme.ts.template](./build-theme.ts.template)
4. Wire `package.json` scripts — see [package.json.snippet](./package.json.snippet)
5. Import `./generated/theme.css` in app entry (production)
6. Replace SCSS breakpoint mixins with `@use '../generated/breakpoints' as bp;`
7. Remove: `_scale-maps.scss`, utility SCSS generators, `ThemeBuilder`/`RawThemeBuilder` usage
8. Update CI — see [publish.yml.snippet](./publish.yml.snippet)

## Verify

- Hashed class names in `theme.css` match runtime (`createTheme` with same config + `mode: 'hashed'`)
- `data-theme` toggling switches scheme colors
- `@include bp.tablet { ... }` compiles from generated `_breakpoints.scss`
