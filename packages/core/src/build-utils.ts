/**
 * Build-time theme generation helpers (not needed in browser runtime).
 */
export {
	buildUtilityClassMap,
	buildUtilityClassMapFromParts,
	rewriteUtilityCss,
	type UtilityClassMapMode,
} from './utils/utility-class-map.js';
export { collectClassNames, buildThemeClassMap } from './config/collectClassNames.js';
export {
	UTILITY_CLASS_HASH_PREFIX,
	UTILITY_CLASS_HASH_SALT,
	hashUtilityClass,
} from './utils/utility-class-hash.js';
export {
	generateThemeArtifacts,
	type ColorSchemeInitScriptOptions,
	type GenerateThemeArtifactsOptions,
} from './config/generateThemeArtifacts.js';
export {
	buildColorSchemeInitScript,
	buildColorSchemeInitScriptHtmlSnippet,
	type BuildColorSchemeInitScriptOptions,
} from './buildColorSchemeInitScript.js';
export {
	resolveColorSchemeFromCookie,
	type ResolveColorSchemeFromCookieOptions,
} from './resolveColorSchemeFromCookie.js';
export { exportDesignTokens, type DesignTokensDocument } from './exportDesignTokens.js';
export { lintThemeContrast, type ThemeContrastWarning } from './lintThemeContrast.js';
export { themeBuilder, type ThemeBuilderVitePluginOptions } from './vite-plugin-theme-builder.js';
export { buildThemeStylesheet, resolveSchemes, resolveDefaultScheme } from './config/buildThemeStylesheet.js';
export { buildBreakpointsScss } from './config/buildBreakpointsScss.js';
